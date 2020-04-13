import { iUser } from './../chat-list/model/user.model';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { shareReplay, take } from 'rxjs/operators'
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private afs: AngularFirestore) { }


  /**
   * get users from firebase 
   * @param userSesion 
   * @param limit 
   */
  getUsers(userSesion? : iUser ,limit: number = 50): Observable<any> {

    return this.afs.collection<iUser[]>('users', ref => ref.limit(limit)).valueChanges().pipe(shareReplay(1));
  }

   /**
   * get sync users from firebase only once
   * @param userSesion 
   * @param limit 
   */
  getUsersOneTime(userSesion? : iUser ,limit: number = 50){
    return this.afs.collection<iUser[]>('users', ref => ref.limit(limit)).get().pipe(take(1)).toPromise();
  }

   /**
   * get actualUser from firebase 
   * @param email  
   */
  getUser(email : string ) {

    return this.afs.collection<iUser>('users' , ref => ref.where('email', '==', email).limit(1)).get().pipe(take(1)).toPromise();    

  }

  /**
   * experimental Search Users
   *   
   */
  getUsersPromise(userSesion: iUser, limit: number = 50) : Promise<iUser[]> {

    let resolveFunction: (result: iUser[]) => void;
    const promise = new Promise<iUser[]>(resolve => {
      resolveFunction = resolve;
    });
    const idUserSesion = (userSesion.idUser) ? userSesion.idUser : userSesion.uid;
    console.log(idUserSesion)
    let collectionL = this.afs.collection<iUser>('users', ref =>
      ref.where('idUser', '<', idUserSesion)).valueChanges();
      collectionL.subscribe(data => {
      let CollectionR = this.afs.collection<iUser>('users', ref =>
      ref.where('idUser', '>', idUserSesion)).valueChanges();
      CollectionR.subscribe(data2 => {
        data2 = data2.concat(data);
        resolveFunction(data2)
      });
    });

    return promise;
    // return this.afs.collection<iUser[]>('users', ref => ref.where('idUser', '<', idUserSesion).where('idUser', '>', idUserSesion).limit(limit)).valueChanges().pipe(shareReplay(1));
  }

}
