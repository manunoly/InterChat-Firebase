import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { iMessage } from './../chat-list/model/message.model';
import { iChat } from './../chat-list/model/chat.model';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay } from 'rxjs/operators'
import { Observable } from "rxjs";


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
    return this.afs.collection<iMessage[]>('chat/' + id + '/messages', ref => ref.orderBy('timestamp', "desc").limit(limit)).snapshotChanges().pipe(shareReplay(1));
  }

}
