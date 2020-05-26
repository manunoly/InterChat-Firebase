import { iUser } from './../chat-list/model/user.model';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { iChat } from '../chat-list/model/chat.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private afs: AngularFirestore) {}

  /**
   * get users from firebase
   * @param userSesion
   * @param limit
   */
  getUsers(userSesion?: iUser, limit: number = 50): Observable<any> {
    return this.afs
      .collection<iUser[]>('users', (ref) => ref.limit(limit))
      .valueChanges()
      .pipe(shareReplay(1));
  }

  /**
   * get sync users from firebase only once
   * @param userSesion
   * @param limit
   */
  getUsersOneTime(userSesion?: iUser, limit: number = 50) {
    return this.afs
      .collection<iUser[]>('users', (ref) => ref.limit(limit))
      .get()
      .pipe(take(1))
      .toPromise();
  }

  /**
   * get actualUser from firebase
   * @param email
   */
  getUser(email: string) {
    return this.afs
      .collection<iUser>('users', (ref) =>
        ref.where('email', '==', email).limit(1)
      )
      .get()
      .pipe(take(1))
      .toPromise();
  }

  getGenericUserSupport() {
    return this.afs
      .collection<iUser>('users', (ref) =>
        ref.where('type', '==', 'genericSupport').limit(1)
      )
      .get()
      .pipe(take(1))
      .toPromise();
  }

  async queryCheckExistChatSupport(idUser: string) {
    return await this.afs
      .collection<iChat[]>('chats', (ref) => {
        let query: firebase.firestore.Query = ref;

        query = query.where('participantsIDS', 'array-contains', idUser);
        query = query.where('status', '==', 'open');

        return query;
      })
      .get()
      .pipe(take(1))
      .toPromise();
  }

  /**
   *
   * @param idUser
   * @param urlLinkAvatar
   */
  updateFirebaseAvatarUrl(idUser: string, urlLinkAvatar: string) {
    this.updateCreateAt('users/' + idUser, { avatar: urlLinkAvatar });

    this.updateChatListAvatarURL(idUser, urlLinkAvatar);
  }

  /**
   *
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

  async updateChatListAvatarURL(idUser: string, urlLinkAvatar: string) {
    try {
      //Obteniendo los chats referenciados en donde existe el user
      const documentSnapshotArray = await this.afs
        .collection<iChat[]>('chats', (ref) =>
          ref.where('participantsIDS', 'array-contains', idUser)
        )
        .get()
        .pipe(take(1))
        .toPromise();

      const batchArray: firebase.firestore.WriteBatch[] = [];
      batchArray.push(this.afs.firestore.batch());
      let operationCounter = 0;
      let batchIndex = 0;

      documentSnapshotArray.forEach((documentSnapshot) => {
        const documentData = documentSnapshot.data();

        // console.log(documentData);

        // update document data here...
        for (const index in documentData.participantsMeta) {
          const element = documentData.participantsMeta[index];
          if (element.idUser == idUser) {
            documentData.participantsMeta[index].avatar = urlLinkAvatar;
          }
        }
        // console.log(documentData);

        batchArray[batchIndex].update(documentSnapshot.ref, documentData);
        operationCounter++;

        if (operationCounter === 499) {
          batchArray.push(this.afs.firestore.batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

      batchArray.forEach(async (batch) => await batch.commit());

      return;
    } catch (error) {
      console.log(error);
    }
  }

  getOnQueueChats(limit: number = 50): Observable<iChat[]> {
    console.log('====GETTING CHATS FROM QUEUE====');

    return this.afs
      .collection<iChat>('chats', (ref) => {
        let query: firebase.firestore.Query = ref;
        query = query.where('type', '==', 'callcenter');
        query = query.where('status', '==', 'open');
        query = query.orderBy('createdAt', 'asc').limit(limit);
        return query;
      })
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

/**
 * 
 * @param type user | callcenter | othertype
 * @param directionOrder (optional) 'asc' | 'desc', default = 'asc'
 * @param limit (optional) positive integer, default = 50
 * @return Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>
 */
  getUsersByType(type: string , directionOrder: firebase.firestore.OrderByDirection = 'asc', limit: number = 50) {
    return this.afs
      .collection<iUser[]>('users', (ref) =>
        ref.where('type', '==', type).limit(limit).orderBy('userName', directionOrder)
      )
      .get()
      .pipe(take(1))
      .toPromise();
  }
}
