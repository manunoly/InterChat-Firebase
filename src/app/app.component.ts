import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ManageAttachFilesService } from './services/manage-attach-files.service';
import { iRoutePage } from './_routes/routePage.model';
import { AdminRoutes } from './_routes/admin.routes';
import { UserRoutes } from './_routes/user.routes';
import { CallCenterRoutes } from './_routes/callcenter.routes';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages: iRoutePage[] = [
    // {
    //   title: 'Active Chat List',
    //   url: 'chat-list',
    //   icon: 'chatbubbles'
    // },
    // {
    //   title: 'Call Center Chat List',
    //   url: 'call-center-chat-list',
    //   icon: 'list-circle'
    // },
    // {
    //   title: 'Users',
    //   url: 'select-user-to-chat',
    //   icon: 'chatbubbles'
    // },
    // {
    //   title: 'Users in DB',
    //   url: 'users',
    //   icon: 'list-circle'
    // },
    // {
    //   title: 'Settings',
    //   url: 'settings',
    //   icon: 'settings'
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    public chatService: ChatService,
    private manageFiles: ManageAttachFilesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.checkUser();
      this.manageFiles.ngOnInit();
    });
  }

  ngOnInit() {}

  async checkActivedRoute() {
    const path = window.location.pathname.split('/')[1];
    console.log(path);
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.url.toLowerCase() === path.toLowerCase()
      );
    }
  }

  async checkUser() {
    this.authService.userSesion.subscribe((user) => {
      if (user) {
        
        this.loadRoutesByRole(user.type);
        this.chatService.loadChatData(user);

        if(user.type == 'callcenter' || user.type == 'admin' )
          this.chatService.loadOnQueueChatData(user);

      } else {
        this.appPages = [];
        this.chatService.clearChatdata();
      } 
    });
  }

  loadRoutesByRole(role: string) {
    if (role == 'admin') {
      this.appPages = AdminRoutes;
    } else if (role == 'user') {
      this.appPages = UserRoutes
    } else if (role == 'callcenter') {
      this.appPages = CallCenterRoutes
    } else {

      console.log('*********** USER ROLE NOT CONTROLLED ********');

    }
  }

  logout() {
    this.selectedIndex = 0;
    this.authService.logout();
  }
}
