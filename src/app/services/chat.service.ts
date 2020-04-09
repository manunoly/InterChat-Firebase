import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { iMessage } from './../chat-list/model/message.model';
import { iChat } from './../chat-list/model/chat.model';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay } from 'rxjs/operators'
import { Observable } from "rxjs";

import * as firebaseApp from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private afs: AngularFirestore) {
  }

  /**
   * @param user // if (user.isAnonymous === false) by firebase auth user
   * @param limit limit de number of chat, defauld 50
   */
  getChats(user: iUser, limit: number = 50): Observable<any> {
    console.log('getChat by user');

    return this.afs.collection<iChat[]>('chat', ref => ref.where('participantsIDS', 'array-contains', user.idUser).limit(limit)).snapshotChanges().pipe(shareReplay(1));
  }

  getAllChat(limit: number = 50): Observable<any> {
    console.log('getAllChat');

    return this.afs.collection<iChat[]>('chat', ref => ref.orderBy('timestamp', "desc").limit(limit)).snapshotChanges().pipe(shareReplay(1));

  }

  /**
   * @param id chat 
   * @param limit number of messages, default 50,
   */
  getMessageByChatId(id: string, limit: number = 50): Observable<any> {
    return this.afs.collection<iMessage[]>('chat/' + id + '/messages', ref => ref.orderBy('timestamp', "desc").limit(limit)).valueChanges().pipe(shareReplay(1));
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
    
    const chat: iChat = {
      idChat: userCreated.idUser + user.idUser,
      title: 'Chat ' + userCreated.idUser + user.idUser,
      createdBy: userCreated.idUser,
      type: type,
      createdAt: firebaseApp.database.ServerValue.TIMESTAMP,
      updatedAt: firebaseApp.database.ServerValue.TIMESTAMP,
      typing: false,
      lastMessage: '',
      typeLastMessage: '',
      timestamp: firebaseApp.database.ServerValue.TIMESTAMP,
      participantsIDS: [userCreated.idUser, user.idUser],
      participantsMeta: [userCreated, user]
    }

    return this.updateCreateAt('chat/' + chat.idChat, chat)
  }
  

}
