import { ManageWebAttachFilesService } from './../../services/manage-web-attach-files.service';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { IonContent, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { iChat } from '../model/chat.model';
import { iMessage } from '../model/message.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { iUser } from '../model/user.model';
import * as moment from 'moment';
import { StorageAppService } from 'src/app/services/storage-app.service';
import { Subscription } from 'rxjs';
import { ManageAttachFilesService } from 'src/app/services/manage-attach-files.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { iFile, iFileUpload } from '../model/file.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatMenuComponent } from 'src/app/shared/chat-menu/chat-menu.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('IonContent', { static: false }) content: IonContent;
  @ViewChild('divContent', { static: false }) divContent: ElementRef;
  
  paramData: any;
  msgList: iMessage[] = [];
  userName: any;
  user_input: string = '';
  User: string = 'Me';
  toUser: string = 'Bot';
  start_typing: any;
  loader: boolean;

  today = this.utilChatService.timestampServerNow.toDate();
  chatSelected: iChat;

  userSesion: iUser;

  messageDateString: string;

  subscriptions: Subscription[] = [];

  loadingChats = false;
  loadingAFile = false;

  attachBox = false;

  isCordova = false;
  acceptedMimeTypes = '';

  recordingAudio = false;

  constructor(
    public activRoute: ActivatedRoute,
    private router: Router,
    private authFirebaseService: AuthService,
    private afs: AngularFirestore,
    public utilChatService: UtilService,
    private chatService: ChatService,
    private storageApp: StorageAppService,
    private keyboard: Keyboard,
    public manageFiles: ManageAttachFilesService,
    private detectorChangeRef: ChangeDetectorRef,
    private webManageFiles: ManageWebAttachFilesService,
    private iab: InAppBrowser,
    public utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private popoverController: PopoverController
  ) {
    this.isCordova = this.utilChatService.isCordova();

    this.chatSelected = this.chatService.chatData;
    this.userSesion = this.authFirebaseService.userSesion.value;

    if (this.chatSelected) {
      this.scrollDown();

      console.log(this.chatSelected);

      //=================== CLEAR UNREAD MESSAGES ON Costructor

      this.clearUnreadMessages();

      //===========================================

      this.loadMessageHistory();

      this.scrollDown();
      // this.subscribeAndGetAllMessages();

      this.subscriptions.push(this.chatService.stateChatDataActual.subscribe(stateChat => {
        if(stateChat){
          console.log('=======> Current Status Chat <========');
          console.log(stateChat.status)
          this.chatSelected = stateChat;  
          
          //CLEAN ACTUAL STATE BECAUSE NOT MORE NEEDED
          if(stateChat.status == 'closed'){
            this.chatService.stateChatDataActual.next(null);
          }      
        }
      }));


    } else {
      this.router.navigate(['chat-list']);
    }

    // this.loadMessageHistory();

    this.acceptedMimeTypes = this.utilChatService.acceptedMimeTypes('document');
  }

  ngOnInit() {
    this.scrollDown();
    this.keyboardWatch();
  }

  ngOnDestroy() {
    this.utilChatService.unsubscribeFrom(this.subscriptions);
    this.subscriptions = [];

    //=================== UPDATE LAST MESSAGE READED BY USER

    this.updateLastMessageReaded();

    //===========================================

    //=================== CLEAR UNREAD MESSAGES WHEN Close the View

    this.clearUnreadMessages();

    //===========================================
    if(this.chatService.stateChatDataActual.value){
      this.chatService.stateChatDataActual.next(null);
      console.log('State Chat =>' ,  this.chatService.stateChatDataActual.value);
    }
    
  }

  onFileSelected(event) {
    const file = event.target.files[0] as File;
    console.log(file);
    if (this.acceptedMimeTypes.indexOf(file.type) != -1) {
      if (file)
        this.webManageFiles
          .uploadFile(file)
          .then((resp) => {
            console.log(resp);
            if (resp) {
              const resultDataFile = this.webManageFiles.getIFileFromInput(
                file
              );
              console.log(resultDataFile);
              // this.sendMsgAttach(resultDataFile);

              this.sendMsgAttchInputWeb(resultDataFile, resp);
            }
          })
          .catch((error) => {
            console.log('fue error', error);
          });
    } else {
      this.utilChatService.showToast(
        `The Document with extension "${file.name
          .split('.')
          .pop()}" is not supported`
      );
    }
  }

  /**
   *
   * @param type 'camera' | 'gallery' | 'document'
   */
  async selectAttach(type: string, uploaderFileInput) {
    console.log(uploaderFileInput);

    if (this.isCordova) {
      try {
        if (type == 'document') {
          this.acceptedMimeTypes = this.utilChatService.acceptedMimeTypes(type);
          this.cdr.detectChanges();
          uploaderFileInput.click();
          return;
        }

        const resultData = await this.manageFiles.selectAttachAction(type);
        console.log(resultData);

        if (resultData) this.sendMsgAttach(resultData);
      } catch (error) {
        console.log('error retrieve attach');
        console.log(error);
      }
    } else {
      //Web Functionability
      this.acceptedMimeTypes = this.utilChatService.acceptedMimeTypes(type);
      this.cdr.detectChanges();
      uploaderFileInput.click();
    }
  }

  sendMsgAttchInputWeb(file: iFile, metaFileUpload: iFileUpload) {
    const idMessage = this.afs.createId();

    console.log(idMessage);

    const newMsg: iMessage = {
      idMessage: idMessage,
      idSender: this.authFirebaseService.userSesion.value.idUser,
      timestamp: this.utilChatService.timestampServerNow,
      type: file.type,
      message: file.type,
      path: file.path ? file.path : null,
      fileMimeTyme: file.mimeType,
      localFileName: file.name,
      fileName: metaFileUpload.fileName,
      fileURL: metaFileUpload.fileURL,
    };

    console.log(newMsg);

    // this.msgList.push(newMsg);
    this.scrollDown();
    this.detectorChangeRef.detectChanges();
    this.toggleAttachBox();

    // this.storageApp.setMessagesByChat(this.chatSelected.idChat, this.msgList);
    this.chatService.pushNewMessageChat(
      this.chatSelected.idChat,
      newMsg,
      this.chatSelected.idUserReciever
    );
  }

  async sendMsgAttach(file: iFile, isFromAudio = false) {
    const idMessage = this.afs.createId();

    console.log(idMessage);

    const newMsg: iMessage = {
      idMessage: idMessage,
      idSender: this.authFirebaseService.userSesion.value.idUser,
      timestamp: this.utilChatService.timestampServerNow,
      type: file.type,
      message: file.type,
      path: file.path,
      fileMimeTyme: file.mimeType,
      localFileName: file.name,
      audioDuration: file.audioDurationSeconds
        ? file.audioDurationSeconds
        : null,
    };

    console.log(newMsg);

    // this.msgList.push(newMsg);
    this.scrollDown();
    this.detectorChangeRef.detectChanges();
    if (!isFromAudio) this.toggleAttachBox();

    try {
      this.loadingAFile = true;
      const resultUploadFile = await this.manageFiles.uploadFile(
        file.fileEntry
      );
      console.log(resultUploadFile);

      this.loadingAFile = false;

      // Realizando Correciones luego de la carga del archivo
      // const indexMessage = this.msgList.findIndex(
      //   (message) => message.idMessage === idMessage
      // );

      // this.msgList[indexMessage].fileName = resultUploadFile.fileName;
      // this.msgList[indexMessage].fileURL = resultUploadFile.fileURL;

      newMsg.fileName = resultUploadFile.fileName;
      newMsg.fileURL = resultUploadFile.fileURL;

      // this.storageApp.setMessagesByChat(this.chatSelected.idChat, this.msgList);

      this.chatService.pushNewMessageChat(
        this.chatSelected.idChat,
        newMsg,
        this.chatSelected.idUserReciever
      );
    } catch (error) {
      console.log(error);
      console.log('error Uploading File');
    }
  }

  sendMsg() {
    if (this.user_input !== '') {
      const idMessage = this.afs.createId();

      // console.log(idMessage);

      const newMsg: iMessage = {
        idMessage: idMessage,
        idSender: this.authFirebaseService.userSesion.value.idUser,
        timestamp: this.utilChatService.timestampServerNow,
        type: 'string',
        message: this.user_input,
      };

      console.log(newMsg);
      // this.msgList.push(newMsg);
      this.chatService.pushNewMessageChat(
        this.chatSelected.idChat,
        newMsg,
        this.chatSelected.idUserReciever
      );

      this.user_input = '';
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
    // console.log('scrolling down...');
    setTimeout(() => {
      this.content.scrollToBottom(50);

      if(!this.isCordova){ // WEB SCROLL TO BOTTOM
        try {
          this.divContent.nativeElement.scroll({
            top: this.divContent.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
  
      } catch(err) {
        console.log(err)
       }
      }
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

      let flagReaded = true;

      for (const iterator of messagesStorage) {
        iterator.timestamp = this.utilChatService.newTimeStampFirestore(
          iterator.timestamp.seconds,
          iterator.timestamp.nanoseconds
        );
      }

      this.msgList = messagesStorage;

      this.subscribeAndGetOnlyNewMessages();
    } else {
      console.log('none messages on storage');
      this.subscribeAndGetAllMessages();
    }

    this.scrollDown();
  }

  subscribeAndGetOnlyNewMessages() {
    console.log('Getting New Messages...');

    this.subscriptions.push(
      this.chatService
        .getNewsMessageByChatId(
          this.chatSelected.idChat,
          this.msgList[this.msgList.length - 1].timestamp
        )
        .subscribe((messages) => {
          console.log('======NewMessages on this ChatSesion======');
          console.log(messages);

          this.msgList = [...this.msgList, ...messages];

          // avoid same message to push on the view locally when come from db
          // this.msgList = this.msgList.filter(
          //   (message, index) =>
          //     this.msgList.findIndex(
          //       (messageUnique) => messageUnique.idMessage === message.idMessage
          //     ) === index
          // );

          // CHECKING STATUS MESSAGES FOR SENDED OR READED

          this.checkStatusMessages();

          this.updateLastMessageReaded();

          this.storageApp.setMessagesByChat(
            this.chatSelected.idChat,
            this.msgList
          );
          this.scrollDown();
        })
    );

    // console.log('======ALL MESSAGES======');
    // console.log(this.msgList);
    this.scrollDown();
  }

  subscribeAndGetAllMessages() {
    console.log('Getting ALL THE MESSAGES...');

    this.loadingChats = true;

    this.subscriptions.push(
      this.chatService
        .getMessageByChatId(this.chatSelected.idChat)
        .subscribe((messages) => {
          this.loadingChats = false;

          console.log('estos son los mensajes de este chat ', messages);
          this.msgList = messages;

          // CHECKING STATUS MESSAGES FOR SENDED OR READED

          this.checkStatusMessages();

          this.updateLastMessageReaded();

          this.storageApp.setMessagesByChat(this.chatSelected.idChat, messages);
          this.scrollDown();
        })
    );
  }

  clearUnreadMessages() {
    console.log('------->Trying to Clear Unreaded Messages<-------');

    if (this.chatSelected) {
      let readedMessages = 0;
      for (const index in this.chatService.chatData$.value) {
        if (
          this.chatService.chatData$.value[index].idChat ==
          this.chatSelected.idChat
        ) {
          readedMessages = this.chatService.chatData$.value[index]
            .unreadMessagesLocal
            ? this.chatService.chatData$.value[index].unreadMessagesLocal
            : 0;
        }
      }

      if (readedMessages > 0) {
        // to validate Quantity of Readed/Unreaded Messages

        console.log('Clearing Unreaded Messages');
        console.log('Messages to Clear Counter => ', readedMessages);

        this.chatService.clearUnreadMessagesFirebase(
          this.chatSelected.idChat,
          this.userSesion.idUser,
          readedMessages
        );
      } else {
        console.log('------->Nothing to clear<-------');
      }
    }
  }

  checkStatusMessages() {
    let flagReaded = true;

    for (const iterator of this.msgList) {
      //TODO: VALIDATE idLastMessageReaded by the other user

      if (iterator.idSender == this.userSesion.idUser) {
        if (
          !this.chatSelected['idLastReadedMessage_' + this.userSesion.idUser]
        ) {
          iterator.statusMessage = 'sended';
          continue;
        }

        if (flagReaded) {
          iterator.statusMessage = 'readed';
        } else {
          iterator.statusMessage = 'sended';
        }

        if (
          this.chatSelected['idLastReadedMessage_' + this.userSesion.idUser] &&
          this.chatSelected['idLastReadedMessage_' + this.userSesion.idUser] ==
            iterator.idMessage
        ) {
          flagReaded = false;
          iterator.statusMessage = 'readed';
        }
      }
    }
  }

  updateLastMessageReaded() {
    const msgListLength = this.msgList.length;

    for (let index = msgListLength - 1; index >= 0; --index) {
      if (this.msgList[index].idSender == this.chatSelected.idUserReciever) {
        console.log('Last Message READED BY ME');
        console.log(this.msgList[index]);

        console.log('------->Trying to Update LastReaded Message<-------');

        //VALIDATING THE LAST MESSAGE READED BY USER IS DIFERENT
        if (
          this.chatSelected[
            'idLastReadedMessage_' + this.chatSelected.idUserReciever
          ] != this.msgList[index].idMessage
        ) {
          console.log('------->Updating...<-------');
          this.chatService.updateLastMessageReaded(
            this.chatSelected.idChat,
            this.chatSelected.idUserReciever,
            this.msgList[index].idMessage
          );
        } else {
          console.log('------->NOTHING to Update<-------');
        }
        break;
      }
    }
  }

  async openChatMenu(event: any) {
    const popover = await this.popoverController.create({
      component: ChatMenuComponent,
      event: event,
      translucent: true,
      componentProps: {
        typeUser: 'callcenter',
        userInfoToShow: this.chatSelected.userReciever,
        statusChat: this.chatSelected.status
      },
    });
    return await popover.present();
  }

  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================

  async startRecordAudio() {
    this.recordingAudio = true;

    try {
      const resultAudio = await this.manageFiles.recordAudio();

      console.log('RESULT RECORD AUDIO');
      console.log(resultAudio);

      if (resultAudio) this.sendMsgAttach(resultAudio, true);

      this.recordingAudio = false;
    } catch (error) {
      console.log(error);
      this.recordingAudio = false;
    }
  }

  async stopRecordAudio() {
    this.manageFiles.stopRecordAudio();
  }

  async playAudioRecord(message: iMessage) {
    // console.log(message);
    const audio = new Audio(message.fileURL);
    audio.load();
    audio.play();
  }

  audioNotLoaded(event: any, srcFallBackAudio: string) {
    if (event.target.error.code == 4 && event.target.src != srcFallBackAudio) {
      console.log(event);
      event.target.src = srcFallBackAudio;
    }
  }

  audioPlaying(event) {
    // console.log('Playing the audio');
    // console.log(event);
  }

  async openFileMessage(message: iMessage) {
    this.iab.create(message.fileURL, '_system');
  }

  //=================================================================
  //=================================================================
  //=================================================================
  //=================================================================

  checkPath(path: string) {
    return this.manageFiles.pathForFile(path);
  }

  pictNotLoading(event: Event, urlBackup: string, divImage: Element) {
    console.log('=====404=====Some Image no loaded replacing with BackUp');
    console.log('try to Load==>', divImage['style'].backgroundImage);
    divImage['style'].backgroundImage = `url('${urlBackup}')`;
    console.log('Loading BackUp==>', divImage['style'].backgroundImage);
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
    console.log('content tapped...');
    this.attachBox = false;
  }

  ionInputTapped() {
    console.log('input tapped...');
    this.attachBox = false;
    this.updateLastMessageReaded();
  }

  toggleAttachBox() {
    this.attachBox = !this.attachBox;
    console.log(this.attachBox);
    this.scrollDown();

    if (this.attachBox) {
      this.updateLastMessageReaded();
    }
  }

  checkSameDay(messageIndex: number) {
    if (messageIndex === 0) return false;
    return moment(this.msgList[messageIndex - 1].timestamp.toDate()).isSame(
      this.msgList[messageIndex].timestamp.toDate(),
      'day'
    );
  }

  calendarDayFormat(dateRef: Date = this.chatSelected.createdAt.toDate()) {
    return moment(dateRef.toISOString()).calendar(this.today, {
      sameDay: '[Today]',
      nextDay: 'DD/MM/YYYY',
      nextWeek: 'DD/MM/YYYY',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY',
    });
  }
}
