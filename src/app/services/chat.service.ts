import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { iMessage } from './../chat-list/model/message.model';
import { iChat } from './../chat-list/model/chat.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatCollection: AngularFirestoreCollection<iChat>;

  constructor(private afs: AngularFirestore) {
  }

  getChats(user: iUser, limit: number = 20): Promise<iChat[]> {
    console.log('getChat');

    const chatCollection = this.afs.collection<iChat[]>('chat', ref => ref.where('participantsIDS', 'array-contains', user.idUser)).orderBy('timestamp', "desc").limitToFirst(limit);
    return chatCollection.get().pipe().toPromise();
  }

  getMessageByChatId(id: string, limit: number = 20): Promise<iChat[]> {
    return this.afs.collection<iMessage[]>('chat/' + id + '/messages').orderBy('timestamp', "desc").limitToFirst(limit);
  }

}
