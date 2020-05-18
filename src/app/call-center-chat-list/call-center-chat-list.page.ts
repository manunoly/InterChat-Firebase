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

  constructor(private router: Router,
    private chatService: ChatService,
    public utilService: UtilService,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    private dbFirebaseService: DbService) { }

  ngOnInit() {
    this.chatsOnQueue = this.chatService.chatQueueData$;
  }

  selectChatToProcess(selectedChat : iChat) {
    console.log(selectedChat);
    // this.chatService.setChatData(selectedChat);
    // this.router.navigate(['chat']);
  }


}
