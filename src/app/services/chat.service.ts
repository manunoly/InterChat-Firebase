import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { iMessage } from './../chat-list/model/message.model';
import { iChat } from './../chat-list/model/chat.model';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay, map } from 'rxjs/operators'
import { Observable } from "rxjs";
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

 private chatDataActual : any ;


  constructor(private afs: AngularFirestore,
    private utilService : UtilService) {
  }

  /**
   * @param user // if (user.isAnonymous === false) by firebase auth user
   * @param limit limit de number of chat, defauld 50
   */
  getChats(user: iUser, limit: number = 50): Observable<any> {
    console.log('getChat by user');

    console.log(user);

    return this.afs.collection<iChat>('chats', ref => ref.where('participantsIDS', 'array-contains', user.idUser).limit(limit)).snapshotChanges()
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
   * 
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
   * 
   * @param userCreated iUser that create the chat
   * @param user iUser to chat
   * @param type user | callcenter
   */

  async createChat(userCreated: iUser, user: iUser, type: string): Promise<any> {

    const idChat = this.setOneToOneChat(userCreated.idUser , user.idUser);

    // Lets check if idChat is created by one of the users before

    try {
      
      const chatRef = (await this.chatExist(idChat));
      console.log(chatRef)
      console.log('chat Exist => ' , chatRef.exists)

      if(!chatRef.exists){ // Create NEW CHAT

        const chat: iChat = {
          idChat: idChat,
          title: 'Chat ' + idChat,
          createdBy: userCreated.idUser,
          type: type,
          createdAt: this.utilService.serverTimestamp,
          updatedAt: this.utilService.serverTimestamp,
          typing: false,
          lastMessage: '',
          typeLastMessage: '',
          timestamp: this.utilService.serverTimestamp,
          participantsIDS: [userCreated.idUser, user.idUser],
          participantsMeta: [userCreated, user]
        }

        console.log('======Creating new Chat======');
        console.log(chat);
        
        try {

          const createdChat = await this.updateCreateAt('chats/' + idChat , chat);

          return new Promise((resolve)=>{
            this.chatDataActual = chat;
            resolve({chatRef : chat , exist : true});
          });

        } catch (error) {
          console.log(error);
          this.utilService.showAlert('Info', 'Error Creating chat. Please try again Later');
        }

      } else { //CHAT EXIST LETS GO TO THE CHAT OR UPDATE SOMETHING

        return new Promise((resolve)=>{
          this.chatDataActual = chatRef.data();
          resolve({chatRef : chatRef.data() , exist : true});
        });
      }

    } catch (error) {
      console.log(error);     
    } 

  }

  async pushNewMessageChat(idChat : string , message : iMessage){

    try {

      const response = await this.updateCreateAt('chats/' + idChat +'/messages/' , message);

      // UPDATING CHAT WITH LAST DATA FROM MESSAGE
      const chatUpdate : iChat = {
        typeLastMessage : message.type,
        updatedAt: message.timestamp,
        lastMessage: message.message      
      }

      this.updateCreateAt('chats/' + idChat , chatUpdate );

    } catch (error) {
      console.log(error);
      this.utilService.showAlert('Info', 'Error sending message. Please try again Later');
    }
    

  }

  setChatData(chatRef){
    this.chatDataActual = chatRef;
  }

  get chatData(){
    return this.chatDataActual;
  }

  private chatExist(idChat : string) {
   return this.afs.collection('chats').doc(idChat).ref.get();
  }

  
  /** Function setup doc path for one to one chat
   * 
   * @param idUser1 id for User #1
   * @param idUser2 id for User #2
   *
   **/
  private setOneToOneChat(idUser1 : string , idUser2 : string) : string {
    //Check if user1’s id is less than user2's
    if (idUser1 < idUser2) {
      return idUser1 + idUser2;
    }
    else {
      return idUser2 + idUser1;
    }
  }


}
