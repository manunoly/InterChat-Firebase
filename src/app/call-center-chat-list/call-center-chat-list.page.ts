import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { iChat } from '../chat-list/model/chat.model';
import { iUser } from '../chat-list/model/user.model';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { UtilService } from '../services/util.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-call-center-chat-list',
  templateUrl: './call-center-chat-list.page.html',
  styleUrls: ['./call-center-chat-list.page.scss'],
})
export class CallCenterChatListPage implements OnInit {
  chatsOnQueue: Observable<iChat[]>;

  subscriptionFirebase: Subscription;
  userSesion: iUser;
  firebaseUser$: Observable<any>;
  textToShowLoading: string;
  stepProcess: number;
  loadingProcess = false;

  constructor(
    private router: Router,
    private chatService: ChatService,
    public utilService: UtilService,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    private dbFirebaseService: DbService
  ) {}

  ngOnInit() {
    this.chatsOnQueue = this.chatService.chatQueueData$;
  }

  async selectChatToProcess(selectedChat: iChat) {
    console.log(selectedChat);

    const confirm = await this.utilService.showAlertConfirmAction(
      'Process Chat',
      'Are you you want to take this chat?'
    );

    if (confirm) {
      try {
        
       const updatedChatSelected = await this.chatService.transferQueueChatToActive(
          selectedChat,
          this.auth.userSesion.value
        );
        this.chatService.setChatData(updatedChatSelected);

        this.router.navigate(['chat-list']).then(_ =>{
          this.router.navigate(['chat']);
        });  

      } catch (error) {
        console.log(error);
      }
    }

    
  }
}
