import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { DbService } from 'src/app/services/db.service';
import { ChatService } from 'src/app/services/chat.service';
import { iChat } from '../model/chat.model';
import { iMessage } from '../model/message.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { iUser } from '../model/user.model';

import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('IonContent', { static: false }) content: IonContent
  paramData: any;
  msgList: iMessage[] = [];
  userName: any;
  user_input: string = "";
  User: string = "Me";
  toUser: string = "Bot";
  start_typing: any;
  loader: boolean;

  today = this.utilService.timestampServerNow.toDate();
  chatSelected: iChat;

  userSesion: iUser;

  messageDateString : string;

  constructor(public activRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afs: AngularFirestore,
    public utilService: UtilService,
    private db: DbService,
    private chatService: ChatService) {

    // this.today.setHours(0,0,0); //valor de hoy a la media noche para verificar cambio de dia por probar si la validacion con moment falla

    this.chatSelected = this.chatService.chatData;
    this.userSesion = this.authService.userSesion.value;

    if (this.chatSelected) {

      console.log(this.chatSelected);

      this.chatService.getMessageByChatId(this.chatSelected.idChat).subscribe(messages => {

        console.log('estos son los mensajes de este chat ', messages);
        this.msgList = messages;
        this.scrollDown();

      });
      this.scrollDown();

    } else {
      this.router.navigate(['chat-list']);
    }

    this.loadMessageHistory();
  }

  ngOnInit() {

    this.scrollDown();

  }
  sendMsg() {
    if (this.user_input !== '') {


      const idMessage = this.afs.createId();

      console.log(idMessage);

      const newMsg: iMessage = {
        idMessage: idMessage,
        idSender: this.authService.userSesion.value.idUser,
        timestamp: this.utilService.timestampServerNow,
        type: 'string',
        message: this.user_input
      }

      console.log(newMsg);
      this.msgList.push(newMsg);
      this.chatService.pushNewMessageChat(this.chatSelected.idChat, newMsg);

      this.user_input = "";
      this.scrollDown();

      // setTimeout(() => {
      //   this.senderSends()
      // }, 500);

    }
  }

  senderSends() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
      this.scrollDown()
    }, 5000)
    this.scrollDown()
  }

  private scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 50);
  }

  userTyping(event: any) {
    // console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown()
  }

  loadMessageHistory() {
    // this.msgList = [
    //   {
    //     userId: "Bot",
    //     userName: "Bot",
    //     userAvatar: "./assets/icon/favicon.png",
    //     time: "12:00",
    //     message: "Hello, have you seen this great chat UI",
    //     id: 0
    //   },
    //   {
    //     userId: "Me",
    //     userName: "Me",
    //     userAvatar: "./assets/icon/favicon.png",
    //     time: "12:03",
    //     message: "Yeah, I see this. This looks great. ",
    //     id: 1,
    //   },
    //   {
    //     userId: "Bot",
    //     userName: "Bot",
    //     userAvatar: "./assets/icon/favicon.png",
    //     time: "12:05",
    //     message: "... and this is absolutely Awesome",
    //     id: 3
    //   },
    //   {
    //     userId: "Me",
    //     userName: "Me",
    //     userAvatar: "./assets/icon/favicon.png",
    //     time: "12:06",
    //     message: "wow ! that's great.",
    //     id: 4
    //   },
    //   {
    //     userId: "Bot",
    //     userName: "Bot",
    //     userAvatar: "./assets/icon/favicon.png",
    //     time: "12:07",
    //     message: "Let's Check this chat App with nice base Style and with Ionic 5",
    //     id: 5
    //   }
    // ];
  }

  trackByFnmessages(id, message: iMessage) {
    return message.idMessage;
  }

  checkSameDay(messageIndex: number) {
    if (messageIndex === 0) return false;
    return moment(this.msgList[messageIndex - 1].timestamp.toDate()).isSame(this.msgList[messageIndex].timestamp.toDate(), 'day');
  }

  calendarDayFormat(dateRef: Date = this.chatSelected.createdAt.toDate()) {
    return moment(dateRef.toISOString()).calendar(this.today, {
      sameDay: '[Today]',
      nextDay: 'DD/MM/YYYY',
      nextWeek: 'DD/MM/YYYY',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

}
