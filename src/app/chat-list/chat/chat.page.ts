import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { IonContent, ModalController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { UtilService } from "src/app/services/util.service";
import { DbService } from "src/app/services/db.service";
import { ChatService } from "src/app/services/chat.service";
import { iChat } from "../model/chat.model";
import { iMessage } from "../model/message.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { iUser } from "../model/user.model";

import * as moment from "moment";
import { StorageAppService } from "src/app/services/storage-app.service";
import { Subscription } from "rxjs";
import { ManageAttachFilesService } from "src/app/services/manage-attach-files.service";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { iFile } from "../model/file.model";
import { ModalImagePage } from 'src/app/modals/modal-image/modal-image.page';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild("IonContent", { static: false }) content: IonContent;
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

  messageDateString: string;

  subscriptions: Subscription[] = [];

  loadingChats = false;
  loadingAFile = false;

  attachBox = false;

  isCordova = false;

  constructor(
    public activRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afs: AngularFirestore,
    public utilService: UtilService,
    private db: DbService,
    private chatService: ChatService,
    private storageApp: StorageAppService,
    private keyboard: Keyboard,
    public manageFiles: ManageAttachFilesService,
    private detectorChangeRef: ChangeDetectorRef,
    private modalController: ModalController
  ) {
    this.isCordova = this.utilService.isCordova();

    this.chatSelected = this.chatService.chatData;
    this.userSesion = this.authService.userSesion.value;

    if (this.chatSelected) {
      this.scrollDown();

      console.log(this.chatSelected);
      this.loadMessageHistory();

      this.scrollDown();
      // this.subscribeAndGetAllMessages();
    } else {
      this.router.navigate(["chat-list"]);
    }

    // this.loadMessageHistory();
  }

  ngOnInit() {
    this.scrollDown();
    this.keyboardWatch();
  }

  ngOnDestroy() {
    this.utilService.unsubscribeFrom(this.subscriptions);
    this.subscriptions = [];
  }

  /**
   *
   * @param type 'camera' | 'gallery'
   */
  async selectAttach(type: string) {
    if (this.isCordova) {
      try {
        const resultData = await this.manageFiles.selectAttachAction(type);
        console.log(resultData);

        this.sendMsgAttach(resultData);
      } catch (error) {
        console.log("error retrieve attach");
        console.log(error);
      }
    } else {
      this.utilService.showToast("This Functionality is not supported on Web");
    }
  }

  async sendMsgAttach(file: iFile) {
    const idMessage = this.afs.createId();

    console.log(idMessage);

    const newMsg: iMessage = {
      idMessage: idMessage,
      idSender: this.authService.userSesion.value.idUser,
      timestamp: this.utilService.timestampServerNow,
      type: file.type,
      message: file.type,
      path: file.path,
      fileMimeTyme: file.mimeType,
      localFileName: file.name,
    };

    console.log(newMsg);

    this.msgList.push(newMsg);
    this.scrollDown();
    this.detectorChangeRef.detectChanges();
    this.toggleAttachBox();

    try {
      this.loadingAFile = true;
      const resultUploadFile = await this.manageFiles.uploadFile(
        file.fileEntry
      );
      console.log(resultUploadFile);

      this.loadingAFile = false;

      // Realizando Correciones luego de la carga del archivo
      const indexMessage = this.msgList.findIndex(
        (message) => message.idMessage === idMessage
      );

      this.msgList[indexMessage].fileName = resultUploadFile.fileName;
      this.msgList[indexMessage].fileURL = resultUploadFile.fileURL;

      newMsg.fileName = resultUploadFile.fileName;
      newMsg.fileURL = resultUploadFile.fileURL;

      this.storageApp.setMessagesByChat(this.chatSelected.idChat, this.msgList);

      this.chatService.pushNewMessageChat(this.chatSelected.idChat, newMsg);
    } catch (error) {
      console.log(error);
      console.log("error Uploading File");
    }
  }

  sendMsg() {
    if (this.user_input !== "") {
      const idMessage = this.afs.createId();

      console.log(idMessage);

      const newMsg: iMessage = {
        idMessage: idMessage,
        idSender: this.authService.userSesion.value.idUser,
        timestamp: this.utilService.timestampServerNow,
        type: "string",
        message: this.user_input,
      };

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
      this.scrollDown();
    }, 5000);
    this.scrollDown();
  }

  private scrollDown() {
    console.log("scrolling down...");
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 50);
  }

  userTyping(event: any) {
    // console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown();
  }

  async loadMessageHistory() {
    const messagesStorage = await this.storageApp.getMessagesByChat(
      this.chatSelected.idChat
    );

    if (messagesStorage) {
      console.log(messagesStorage);

      for (const iterator of messagesStorage) {
        iterator.timestamp = this.utilService.newTimeStampFirestore(
          iterator.timestamp.seconds,
          iterator.timestamp.nanoseconds
        );
      }

      this.msgList = messagesStorage;

      this.subscribeAndGetOnlyNewMessages();
    } else {
      console.log("none messages on storage");
      this.subscribeAndGetAllMessages();
    }

    this.scrollDown();
  }

  subscribeAndGetOnlyNewMessages() {
    console.log("Getting New Messages...");

    this.subscriptions.push(
      this.chatService
        .getNewsMessageByChatId(
          this.chatSelected.idChat,
          this.msgList[this.msgList.length - 1].timestamp
        )
        .subscribe((messages) => {
          console.log("======NewMessages on this ChatSesion======");
          console.log(messages);

          this.msgList = [...this.msgList, ...messages];
          // avoid same message to push on the view locally when come from db
          this.msgList = this.msgList.filter(
            (message, index) =>
              this.msgList.findIndex(
                (messageUnique) => messageUnique.idMessage === message.idMessage
              ) === index
          );

          this.storageApp.setMessagesByChat(
            this.chatSelected.idChat,
            this.msgList
          );
          this.scrollDown();
        })
    );

    console.log("======ALL MESSAGES======");
    console.log(this.msgList);
    this.scrollDown();
  }

  subscribeAndGetAllMessages() {
    console.log("Getting ALL THE MESSAGES...");

    this.loadingChats = true;

    this.subscriptions.push(
      this.chatService
        .getMessageByChatId(this.chatSelected.idChat)
        .subscribe((messages) => {
          this.loadingChats = false;

          console.log("estos son los mensajes de este chat ", messages);
          this.msgList = messages;
          this.storageApp.setMessagesByChat(this.chatSelected.idChat, messages);
          this.scrollDown();
        })
    );
  }

  async openModalImage(message: iMessage) {
    const modal = await this.modalController.create({
      component: ModalImagePage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }

  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================

  checkPath(message: iMessage) {
    console.log(this.manageFiles.pathForFile(message.path));
  }

  trackByFnmessages(id, message: iMessage) {
    return message.idMessage;
  }

  async keyboardWatch() {
    this.keyboard.onKeyboardWillShow().subscribe({
      next: (x) => {
        this.scrollDown();
      },
      error: (e) => {
        console.log(e);
      },
    });
    this.keyboard.onKeyboardWillHide().subscribe({
      next: (x) => {
        this.scrollDown();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  ionContentTapped() {
    console.log("content tapped...");
    this.attachBox = false;
  }

  ionInputTapped() {
    console.log("input tapped...");
    this.attachBox = false;
  }

  toggleAttachBox() {
    this.attachBox = !this.attachBox;
    console.log(this.attachBox);
    this.scrollDown();
  }

  checkSameDay(messageIndex: number) {
    if (messageIndex === 0) return false;
    return moment(this.msgList[messageIndex - 1].timestamp.toDate()).isSame(
      this.msgList[messageIndex].timestamp.toDate(),
      "day"
    );
  }

  calendarDayFormat(dateRef: Date = this.chatSelected.createdAt.toDate()) {
    return moment(dateRef.toISOString()).calendar(this.today, {
      sameDay: "[Today]",
      nextDay: "DD/MM/YYYY",
      nextWeek: "DD/MM/YYYY",
      lastDay: "[Yesterday]",
      lastWeek: "DD/MM/YYYY",
      sameElse: "DD/MM/YYYY",
    });
  }
}
