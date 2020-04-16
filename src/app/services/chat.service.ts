import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { iMessage } from './../chat-list/model/message.model';
import { iChat } from './../chat-list/model/chat.model';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay, map } from 'rxjs/operators'
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { StorageAppService } from 'src/app/services/storage-app.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatDataActual: any;
  public chatData$: BehaviorSubject<iChat[]> = new BehaviorSubject(null);
  private chatDataObj : Subscription;
  public offlineData$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private afs: AngularFirestore,
    private utilService: UtilService,
    private authService: AuthService,
    private storageAppService: StorageAppService) { }

  clearChatdata() {
    this.chatDataActual = "";
    if (this.chatDataObj)
      this.chatDataObj.unsubscribe();

    this.chatData$.next(null); //cleanup chatList
    
    // TODO:Remove data from storage javier si se cerro la sesion;
  }

  async loadChatData(user: iUser) {
    this.chatDataObj = this.getChats(user).subscribe(async (chats) => {

      if (this.chatData$.value)
        this.chatData$.value.forEach((oldChat , index) => {
          // console.log('tengo este chat antiguo antes de verificarlo', oldChat);


          if(oldChat.idChat == chats[index].idChat){
            // console.log('same ChatID, lets check if lastMessage changed....')
            if(oldChat.lastMessage != chats[index].lastMessage){
              console.log('New Message in some Chat');
              console.log(chats[index]);
              if(chats[index].lastMessageIdSender != this.authService.userSesion.value.idUser){
                //new message received by some other user
                console.log('======NEW MESSAGE FROM======');
                console.log(`User => ${chats[index].lastMessageUserName}`)

                this.utilService.showToastNewMessageRecieved(chats[index].lastMessageUserName , chats[index].lastMessage);
              }

            }
          }


        });
      else if (chats.length == 0) {
        const tmpChat = await (await this.storageAppService.getChats());
        if (tmpChat.length > 0) {
          chats = tmpChat.map(x => {
            return {
              ...x, ...{
                createdAt: this.utilService.newTimeStampFirestore(x.createdAt.seconds, x.createdAt.nanoseconds),
                updatedAt: this.utilService.newTimeStampFirestore(x.createdAt.seconds, x.createdAt.nanoseconds),
                timestamp: this.utilService.newTimeStampFirestore(x.createdAt.seconds, x.createdAt.nanoseconds)
              }
            }
          });
        }
      }

      console.log('tengo estos chats', chats);

      chats.forEach(chat => {

        for (const iterator of chat.participantsMeta) {
          if (iterator.idUser != user.idUser) {

            chat.avatarUserChat = iterator.avatar;
            chat.title = iterator.userName;
            chat.idUserReciever = iterator.idUser;
            chat.userReciever = iterator;


          }
        }
      });

      this.chatData$.next(chats);
      this.offlineData$.next(false);
      this.storageAppService.setChats(chats);

    });
  }

  /**
   * @param user // if (user.isAnonymous === false) by firebase auth user
   * @param limit limit de number of chat, defauld 50
   */
  getChats(user: iUser, limit: number = 50): Observable<iChat[]> {
    console.log('getChat by user');

    console.log(user);

    return this.afs.collection<iChat>('chats', ref => ref.where('participantsIDS', 'array-contains', user.idUser).orderBy('updatedAt', 'desc').limit(limit)).snapshotChanges()
      .pipe(shareReplay(1), map(x => {
        return x.map(action => {
          const data = action.payload.doc.data() as iChat;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
      );
  }

  getAllChat(limit: number = 50): Observable<any> {
    console.log('getAllChat');

    return this.afs.collection<iChat[]>('chats', ref => ref.orderBy('timestamp', "desc").limit(limit)).snapshotChanges().pipe(shareReplay(1));

  }

  /**
   * @param id chat 
   * @param limit number of messages, default 50,
   */
  getMessageByChatId(id: string, limit: number = 50): Observable<any> {
    return this.afs.collection<iMessage[]>('chats/' + id + '/messages', ref => ref.orderBy('timestamp', "asc").limit(limit)).valueChanges().pipe(shareReplay(1));
  }

  /**
  * @param id chat 
  * @param lastDateMessageUser last timestamp Message On Storage
  * @param limit number of messages, default 50,
  */
  getNewsMessageByChatId(id: string, lastDateMessageUser: firebase.firestore.Timestamp, limit: number = 50): Observable<any> {
    return this.afs.collection<iMessage[]>('chats/' + id + '/messages', ref => ref.orderBy('timestamp', "asc").where('timestamp', '>', lastDateMessageUser.toDate()).limit(limit)).valueChanges().pipe(shareReplay(1));
  }


  /**
   * @param path where to write
   * @param data data to set
   */
  updateCreateAt(path: string, data: Object): Promise<any> {
    const segments = path.split("/").filter(v => v);
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

  async createChat(userCreated: iUser, user: iUser, type: string): Promise<any> {

    const idChat = this.setOneToOneChat(userCreated.idUser, user.idUser);

    // Lets check if idChat is created by one of the users before

    try {

      const chatRef = (await this.chatExist(idChat));
      console.log(chatRef)
      console.log('chat Exist => ', chatRef.exists)

      if (!chatRef.exists) { // Create NEW CHAT

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
          participantsMeta: [userCreated, user]
        }

        console.log('======Creating new Chat======');
        console.log(chat);

        try {

          const createdChat = await this.updateCreateAt('chats/' + idChat, chat);

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
          this.utilService.showAlert('Info', 'Error Creating chat. Please try again Later');
        }

      } else { //CHAT EXIST LETS GO TO THE CHAT OR UPDATE SOMETHING

        console.log('Chat Exist let Proceed to chat page')
        return new Promise((resolve) => {
          // Save to Service to proceed to the chat page

          const chat = chatRef.data();
          // overwrite data needed on chat
          chat.avatarUserChat = user.avatar;
          chat.title = user.userName;
          chat.idUserReciever = user.idUser;
          chat.userReciever = user;

          console.log(chatRef.data());
          this.chatDataActual = chat;
          resolve({ chatRef: chat, exist: true });
        });
      }

    } catch (error) {
      console.log(error);
    }

  }

  async pushNewMessageChat(idChat: string, message: iMessage) {

    try {

      const response = await this.updateCreateAt('chats/' + idChat + '/messages/', message);

      // UPDATING CHAT WITH LAST DATA FROM MESSAGE
      const chatUpdate: iChat = {
        typeLastMessage: message.type,
        updatedAt: message.timestamp,
        lastMessage: message.message,
        lastMessageIdSender: message.idSender,
        lastMessageUserName: this.authService.userSesion.value.userName,
      }

      this.updateCreateAt('chats/' + idChat, chatUpdate);

    } catch (error) {
      console.log(error);
      this.utilService.showAlert('Info', 'Error sending message. Please try again Later');
    }

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
    }
    else {
      return idUser2 + idUser1;
    }
  }


}
