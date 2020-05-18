import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ManageAttachFilesService } from './services/manage-attach-files.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Chat List',
      url: 'chat-list',
      icon: 'chatbubbles'
    },
    // {
    //   title: 'Users',
    //   url: 'select-user-to-chat',
    //   icon: 'chatbubbles'
    // },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'settings'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    private chatService: ChatService,
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

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  async checkUser() {
    this.authService.userSesion.subscribe(user => {
      if (user) {
        this.chatService.loadChatData(user);
      }else
      this.chatService.clearChatdata();
    })
  }

  logout() {
    this.selectedIndex = 0;
    this.authService.logout();

  }
}
