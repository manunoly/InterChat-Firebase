import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('IonContent' , {static: false}) content: IonContent
  paramData: any;
  msgList: any;
  userName: any;
  user_input: string = "";
  User: string = "Me";
  toUser: string = "Bot";
  start_typing: any;
  loader: boolean;

  today = new Date();

  constructor(public activRoute: ActivatedRoute) {
    
    this.today.setHours(0,0,0);
    this.loadMessageHistory();
  }

  ngOnInit() {
    this.scrollDown();
  }
  sendMsg() {
    if (this.user_input !== '') {

      const newMsg = {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: "./assets/icon/favicon.png",
        time: new Date().toTimeString().slice(0,5),
        message: this.user_input,
        id: this.msgList.length + 1
      }

      this.msgList.push(newMsg);

      this.user_input = "";
      this.scrollDown();

      setTimeout(() => {
        this.senderSends()
      }, 500);

    }
  }
  senderSends() {
    this.loader = true;
    setTimeout(() => {
      this.msgList.push({
        userId: this.User,
        userName: this.User,
        userAvatar: "./assets/icon/favicon.png",
        time: new Date().toTimeString().slice(0,5),
        message: "Sorry, didn't get what you said. Can you repeat that please"
      });
      this.loader = false;
      this.scrollDown()
    }, 5000)
    this.scrollDown()
  }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 50);
  }

  userTyping(event: any) {
    console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown()
  }

  loadMessageHistory(){
    this.msgList = [
      {
        userId: "Bot",
        userName: "Bot",
        userAvatar: "./assets/icon/favicon.png",
        time: "12:00",
        message: "Hello, have you seen this great chat UI",
        id: 0
      },
      {
        userId: "Me",
        userName: "Me",
        userAvatar: "./assets/icon/favicon.png",
        time: "12:03",
        message: "Yeah, I see this. This looks great. ",
        id: 1,
      },
      {
        userId: "Bot",
        userName: "Bot",
        userAvatar: "./assets/icon/favicon.png",
        time: "12:05",
        message: "... and this is absolutely Awesome",
        id: 3
      },
      {
        userId: "Me",
        userName: "Me",
        userAvatar: "./assets/icon/favicon.png",
        time: "12:06",
        message: "wow ! that's great.",
        id: 4
      },
      {
        userId: "Bot",
        userName: "Bot",
        userAvatar: "./assets/icon/favicon.png",
        time: "12:07",
        message: "Let's Check this chat App with nice base Style and with Ionic 5",
        id: 5
      }
    ];
  }
}
