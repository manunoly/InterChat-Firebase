import { AngularFirestore } from '@angular/fire/firestore';
import { DbService } from './db.service';
import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';
import { shareReplay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersObj: [string][] = [];

  constructor(private db: DbService, private afs: AngularFirestore) {}

  async getUsersByType(type: string) {
    return this.db.getUsersByType(type);
  }

  getUsersByTypeObservable(
    type: string = 'user',
    directionOrder: firebase.firestore.OrderByDirection = 'asc',
    limit: number = 50,
    force = false
  ) {
    if (this.usersObj[type] && !force) return this.usersObj[type];

    this.usersObj[type] = this.afs
      .collection<iUser>('users', (ref) =>
        ref
          .where('type', '==', type)
          .limit(limit)
          .orderBy('userName', directionOrder)
      )
      .snapshotChanges()
      .pipe(
        shareReplay(1),
        map((x) => {
          return x.map((action) => {
            const data = action.payload.doc.data() as iUser;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        })
      );

    return this.usersObj[type];
  }
}
