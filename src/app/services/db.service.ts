import { iUser } from './../chat-list/model/user.model';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay, map } from 'rxjs/operators'
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private afs: AngularFirestore) { }


  /**
   * get users from firebase 
   * @param limit 
   */
  getUsers(limit: number = 50): Observable<any> {
    return this.afs.collection<iUser[]>('users', ref => ref.limit(limit)).valueChanges().pipe(shareReplay(1));
  }

}
