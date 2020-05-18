import { PlaySoundService } from './play-sound.service';
import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { iMessage } from './../chat-list/model/message.model';
import { iChat } from './../chat-list/model/chat.model';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subscription, of, fromEvent } from 'rxjs';
import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { StorageAppService } from 'src/app/services/storage-app.service';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatDataActual: iChat;
  public chatData$: BehaviorSubject<iChat[]> = new BehaviorSubject(null);
  private chatDataObj: Subscription;

  private chatQueueDataActual: iChat;
  public chatQueueData$: BehaviorSubject<iChat[]> = new BehaviorSubject(null);
  private chatQueueDataObj: Subscription;
  public offlineData$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public unreadedMessagesHome: number;

  constructor(
    private afs: AngularFirestore,
    private utilService: UtilService,
    private authService: AuthService,
    private storageAppService: StorageAppService,
    private sound: PlaySoundService,
    private db: DbService
  ) {}

  clearChatdata() {
    this.chatDataActual = null;
    if (this.chatDataObj) this.chatDataObj.unsubscribe();

    this.chatData$.next(null); //cleanup chatList
    this.unreadedMessagesHome = null;

    this.chatQueueDataActual = null;
    if (this.chatQueueDataObj) this.chatQueueDataObj.unsubscribe();

    this.chatQueueData$.next(null); //cleanup chatList

    // TODO:Remove data from storage javier si se cerro la sesion;
  }

  async loadChatData(user: iUser) {
    if (this.chatDataObj) this.chatDataObj.unsubscribe();

    this.chatDataObj = this.getChats(user).subscribe(async (chats) => {
      if (this.chatData$.value)
        this.chatData$.value.forEach(async (oldChat, index) => {
          // console.log('tengo este chat antiguo antes de verificarlo', oldChat);

          if (oldChat.idChat == chats[index].idChat) {
            // console.log('same ChatID, lets check if lastMessage changed....')
            if (oldChat.lastMessage != chats[index].lastMessage) {
              console.log('New Message in some Chat');
              console.log(chats[index]);

              const userSesion = this.authService.userSesion.value;

              if (chats[index].lastMessageIdSender != userSesion.idUser) {
                //new message received by some other user
                console.log('======NEW MESSAGE FROM======');
                console.log(`User => ${chats[index].lastMessageUserName}`);

                this.utilService.showToastNewMessageRecieved(
                  chats[index].lastMessageUserName,
                  chats[index].lastMessage
                );
                this.sound.play();
              }
            }
          }
        });
      else if (chats.length == 0) {
        const tmpChat = await this.storageAppService.getChats();
        if (tmpChat && tmpChat.length > 0) {
          chats = tmpChat.map((x) => {
            return {
              ...x,
              ...{
                createdAt: this.utilService.newTimeStampFirestore(
                  x.createdAt.seconds,
                  x.createdAt.nanoseconds
                ),
                updatedAt: this.utilService.newTimeStampFirestore(
                  x.createdAt.seconds,
                  x.createdAt.nanoseconds
                ),
                timestamp: this.utilService.newTimeStampFirestore(
                  x.createdAt.seconds,
                  x.createdAt.nanoseconds
                ),
              },
            };
          });
        }
      }

      console.log('=============== ACTIVE CHATS ===============');
      console.log(chats);

      this.unreadedMessagesHome = 0;

      chats.forEach((chat) => {
        for (const iterator of chat.participantsMeta) {
          if (iterator.idUser != user.idUser) {
            chat.avatarUserChat = iterator.avatar;
            chat.title = iterator.userName;
            chat.idUserReciever = iterator.idUser;
            chat.userReciever = iterator;
            chat.unreadMessagesLocal = chat['unreadMessage_' + user.idUser]
              ? chat['unreadMessage_' + user.idUser]
              : null;
          }
        }

        if (
          chat['unreadMessage_' + user.idUser] &&
          chat['unreadMessage_' + user.idUser] > 0
        ) {
          ++this.unreadedMessagesHome;
        }
      });

      this.chatData$.next(chats);
      this.offlineData$.next(false);
      this.storageAppService.setChats(chats);
    });
  }

  async loadOnQueueChatData(user: iUser) {

    if (this.chatQueueDataObj) this.chatQueueDataObj.unsubscribe();

    this.chatQueueDataObj = this.db.getOnQueueChats().subscribe(async (chats) => {
      if (this.chatQueueData$.value)
        this.chatQueueData$.value.forEach(async (oldChat, index) => {
          // console.log('tengo este chat antiguo antes de verificarlo', oldChat);

          if (oldChat.idChat == chats[index].idChat) {
            // console.log('same ChatID, lets check if lastMessage changed....')
            if (oldChat.lastMessage != chats[index].lastMessage) {
              console.log('New Message in some Chat');
              console.log(chats[index]);

              const userSesion = this.authService.userSesion.value;

              if (chats[index].lastMessageIdSender != userSesion.idUser) {
                //new message received by some other user
                console.log('======NEW MESSAGE FROM======');
                console.log(`User => ${chats[index].lastMessageUserName}`);

                this.utilService.showToastNewMessageRecieved(
                  chats[index].lastMessageUserName,
                  chats[index].lastMessage
                );
                this.sound.play();
              }
            }
          }
        });
      else if (chats.length == 0) {
        //NONE FROM STORAGE ONLY ONLINE
      }

      console.log('=============== Chats on QUEUE ===============');
      console.log(chats);

      this.unreadedMessagesHome = 0;

      chats.forEach((chat) => {
        for (const iterator of chat.participantsMeta) {
          //iterator.idUser != user.idUser
          if (iterator.type == 'user') {
            chat.avatarUserChat = iterator.avatar;
            chat.title = iterator.userName;
            chat.idUserReciever = iterator.idUser;
            chat.userReciever = iterator;
            chat.unreadMessagesLocal = chat['unreadMessage_' + user.idUser]
              ? chat['unreadMessage_' + user.idUser]
              : null;
              continue;
          }
        }

        if (
          chat['unreadMessage_' + user.idUser] &&
          chat['unreadMessage_' + user.idUser] > 0
        ) {
          ++this.unreadedMessagesHome;
        }
      });

      this.chatQueueData$.next(chats);
    });
  }

  /**
   * @param user // if (user.isAnonymous === false) by firebase auth user
   * @param limit limit de number of chat, defauld 50
   */
  getChats(user: iUser, limit: number = 50): Observable<iChat[]> {
    console.log('getChat by user');

    console.log(user);

    return this.afs
      .collection<iChat>('chats', (ref) =>
        ref
          .where('participantsIDS', 'array-contains', user.idUser)
          .orderBy('updatedAt', 'desc')
          .limit(limit)
      )
      .snapshotChanges()
      .pipe(
        shareReplay(1),
        map((x) => {
          return x.map((action) => {
            const data = action.payload.doc.data() as iChat;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getAllChat(limit: number = 50): Observable<any> {
    console.log('getAllChat');

    return this.afs
      .collection<iChat[]>('chats', (ref) =>
        ref.orderBy('timestamp', 'desc').limit(limit)
      )
      .snapshotChanges()
      .pipe(shareReplay(1));
  }

  /**
   * @param id chat
   * @param limit number of messages, default 50,
   */
  getMessageByChatId(id: string, limit: number = 50): Observable<any> {
    return this.afs
      .collection<iMessage[]>('chats/' + id + '/messages', (ref) =>
        ref.orderBy('timestamp', 'asc').limit(limit)
      )
      .valueChanges()
      .pipe(shareReplay(1));
  }

  /**
   * @param id chat
   * @param lastDateMessageUser last timestamp Message On Storage
   * @param limit number of messages, default 50,
   */
  getNewsMessageByChatId(
    id: string,
    lastDateMessageUser: firebase.firestore.Timestamp,
    limit: number = 50
  ): Observable<any> {
    return this.afs
      .collection<iMessage[]>('chats/' + id + '/messages', (ref) =>
        ref
          .orderBy('timestamp', 'asc')
          .where('timestamp', '>', lastDateMessageUser.toDate())
          .limit(limit)
      )
      .valueChanges()
      .pipe(shareReplay(1));
  }

  /**
   * @param path where to write
   * @param data data to set
   */
  updateCreateAt(path: string, data: Object): Promise<any> {
    const segments = path.split('/').filter((v) => v);
    if (segments.length % 2) {
      // Odd is always a collection
      return this.afs.collection(path).add(data);
    } else {
      // Even is always document
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  /**
   * @param userCreated iUser that create the chat
   * @param user iUser to chat
   * @param type user | callcenter
   */

  async createChat(
    userCreated: iUser,
    user: iUser,
    type: string
  ): Promise<any> {
    const idChat = this.setOneToOneChat(userCreated.idUser, user.idUser);

    // Lets check if idChat is created by one of the users before

    try {
      const chatRef = await this.chatExist(idChat);
      console.log(chatRef);
      console.log('chat Exist => ', chatRef.exists);

      if (!chatRef.exists) {
        // Create NEW CHAT

        const chat: iChat = {
          idChat: idChat,
          title: 'Chat ' + idChat,
          createdBy: userCreated.idUser,
          type: type,
          createdAt: this.utilService.timestampServerNow,
          updatedAt: this.utilService.timestampServerNow,
          typing: false,
          lastMessage: '',
          typeLastMessage: '',
          timestamp: this.utilService.timestampServerNow,
          participantsIDS: [userCreated.idUser, user.idUser],
          participantsMeta: [userCreated, user],
        };

        console.log('======Creating new Chat======');
        console.log(chat);

        try {
          const createdChat = await this.updateCreateAt(
            'chats/' + idChat,
            chat
          );

          //SEND PUSH NOTIFICATION WITH INVITATION TO CHAT
          //TODO: PUSH NOTIFICATION FROM WEB ???
          // this.db.invitedUserChat(userCreated.idUser, userCreated.userName, user.idUser);

          return new Promise((resolve) => {
            // overwrite data needed on chat
            chat.avatarUserChat = user.avatar;
            chat.title = user.userName;
            chat.idUserReciever = user.idUser;
            chat.userReciever = user;

            // Save to Service to proceed to the chat page
            this.chatDataActual = chat;
            resolve({ chatRef: chat, exist: true });
          });
        } catch (error) {
          console.log(error);
          this.utilService.showAlert(
            'Info',
            'Error Creating chat. Please try again Later'
          );
        }
      } else {
        //CHAT EXIST LETS GO TO THE CHAT OR UPDATE SOMETHING

        console.log('Chat Exist let Proceed to chat page');
        return new Promise((resolve) => {
          // Save to Service to proceed to the chat page

          const chat = chatRef.data();
          // overwrite data needed on chat
          chat.avatarUserChat = user.avatar;
          chat.title = user.userName;
          chat.idUserReciever = user.idUser;
          chat.userReciever = user;

          console.log(chatRef.data());
          this.chatDataActual = chat as iChat;
          resolve({ chatRef: chat, exist: true });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createChatWithSupport(userCreated: iUser): Promise<any> {
    let userGenericSupport: iUser;
    try {
      const response = await this.db.getGenericUserSupport();

      userGenericSupport = response.docs[0].data() as iUser;
    } catch (error) {
      this.utilService.dismissLoading();
      console.log(error);
      this.utilService.showAlert(
        'Info',
        'Error Creating chat With Support. Please try again Later'
      );
      return;
    }

    const idChat = this.afs.createId();

    // Lets check if idChat is created by one of the users before

    try {
      this.utilService.dismissLoading();

      const chatRef = await this.chatSupportExist(userCreated.idUser);
      console.log(chatRef);
      console.log('---> chat Exist??? => ', !chatRef.empty);

      if (chatRef.empty) {
        // Create NEW CHAT

        const chat: iChat = {
          idChat: idChat,
          title: 'Chat ' + idChat,
          createdBy: userCreated.idUser,
          type: 'callcenter',
          createdAt: this.utilService.timestampServerNow,
          updatedAt: this.utilService.timestampServerNow,
          typing: false,
          lastMessage: '',
          typeLastMessage: '',
          timestamp: this.utilService.timestampServerNow,
          participantsIDS: [userCreated.idUser, userGenericSupport.idUser],
          participantsMeta: [userCreated, userGenericSupport],
          status: 'open',
        };

        console.log('======Creating new Chat======');
        console.log(chat);

        try {
          const createdChat = await this.updateCreateAt(
            'chats/' + idChat,
            chat
          );

          //SEND PUSH NOTIFICATION WITH INVITATION TO CHAT
          //TODO: a donde enviar la push notificacion
          // this.db.invitedUserChat(userCreated.idUser, userCreated.userName, userGenericSupport.idUser);

          return new Promise((resolve) => {
            // overwrite data needed on chat
            chat.avatarUserChat = userGenericSupport.avatar;
            chat.title = userGenericSupport.userName;
            chat.idUserReciever = userGenericSupport.idUser;
            chat.userReciever = userGenericSupport;

            // Save to Service to proceed to the chat page
            this.chatDataActual = chat;
            resolve({ chatRef: chat, exist: true });
          });
        } catch (error) {
          console.log(error);
          this.utilService.showAlert(
            'Info',
            'Error Creating chat. Please try again Later'
          );
        }
      } else {
        //CHAT EXIST LETS GO TO THE CHAT OR UPDATE SOMETHING

        console.log('Chat Exist let Proceed to chat page');
        return new Promise((resolve) => {
          // Save to Service to proceed to the chat page

          const chat = chatRef.docs[0].data();
          console.log(chat);
          // overwrite data needed on chat
          chat.avatarUserChat = userGenericSupport.avatar;
          chat.title = userGenericSupport.userName;
          chat.idUserReciever = userGenericSupport.idUser;
          chat.userReciever = userGenericSupport;

          this.utilService.showAlert(
            'Information',
            'Already exists a chat created with the support'
          );

          console.log(chatRef.docs[0].data());
          this.chatDataActual = chat as iChat;
          resolve({ chatRef: chat, exist: true });
        });
      }
    } catch (error) {
      console.log(error);
      this.utilService.dismissLoading();
    }
  }

  async pushNewMessageChat(
    idChat: string,
    message: iMessage,
    idUserReciever: string
  ) {
    try {
      const response = await this.updateCreateAt(
        'chats/' + idChat + '/messages/',
        message
      );

      const userSesion = this.authService.userSesion.value;

      //TODO: PUSH NOTIFICATION NEW CHAT
      // this.db.pushNotificationChat(userSesion.idUser, userSesion.userName, message.message, idUserReciever)

      const increment = this.utilService
        .getInstanceFirebase()
        .firestore.FieldValue.increment(1);
      const unreadId = `unreadMessage_${idUserReciever}`;

      // UPDATING CHAT WITH LAST DATA FROM MESSAGE
      const chatUpdate: iChat = {
        typeLastMessage: message.type,
        updatedAt: message.timestamp,
        lastMessage: message.message,
        lastMessageIdSender: message.idSender,
        lastMessageUserName: userSesion.userName,
      };
      chatUpdate[unreadId] = increment;

      this.updateCreateAt('chats/' + idChat, chatUpdate);
    } catch (error) {
      console.log(error);
      this.utilService.showAlert(
        'Info',
        'Error sending message. Please try again Later'
      );
    }
  }

  async clearUnreadMessagesFirebase(
    idChat: string,
    idUser: string,
    decrementReadedMessages: number
  ) {
    const increment = this.utilService
      .getInstanceFirebase()
      .firestore.FieldValue.increment(-decrementReadedMessages);
    const unreadId = `unreadMessage_${idUser}`;

    // UPDATING CHAT Clear unreadMessage Opened on chat
    const chatUpdate = {};
    chatUpdate[unreadId] = increment;
    this.updateCreateAt('chats/' + idChat, chatUpdate);
  }

  async updateLastMessageReaded(
    idChat: string,
    idUserReciever: string,
    idMessage: string
  ) {
    const idLastReadedMessage = `idLastReadedMessage_${idUserReciever}`;

    const chatUpdate = {};
    chatUpdate[idLastReadedMessage] = idMessage;
    this.updateCreateAt('chats/' + idChat, chatUpdate);
  }

  setChatData(chatRef) {
    this.chatDataActual = chatRef;
  }

  get chatData() {
    return this.chatDataActual;
  }

  private chatExist(idChat: string) {
    return this.afs.collection('chats').doc(idChat).ref.get();
  }

  private async chatSupportExist(idUser: string) {
    try {
      const response = await this.db.queryCheckExistChatSupport(idUser);
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  /** Function setup doc path for one to one chat
   *
   * @param idUser1 id for User #1
   * @param idUser2 id for User #2
   *
   **/
  private setOneToOneChat(idUser1: string, idUser2: string): string {
    //Check if user1’s id is less than user2's
    if (idUser1 < idUser2) {
      return idUser1 + idUser2;
    } else {
      return idUser2 + idUser1;
    }
  }
}
