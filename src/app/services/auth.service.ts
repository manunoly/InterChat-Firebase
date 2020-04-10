import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DbService } from './db.service';
import { iUser } from '../chat-list/model/user.model';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseUser$: Observable<any>;
  userSesion: BehaviorSubject<iUser> = new BehaviorSubject(null);

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private dbService: DbService,
    private storage: Storage) {

    this.firebaseUser$ = this.afAuth.authState;
    console.log(this.firebaseUser$);

    this.firebaseUser$.subscribe(async u => {

      console.log('User Firebase');
      console.log(u);
      // this.user = u;
      if (u) {

        this.userSesion.next({
          uid: u.uid,
          idUser: null,
          userName: u.displayName,
          avatar: u.photoURL,
          email: u.email
        });

        const userLocalStorage = await this.getUserFromStorage();

        if (userLocalStorage) {

          this.userSesion.next(userLocalStorage);

        } else {

          try {
            console.log(u.email);

            const responseUser = (await this.dbService.getUser(u.email)).docs[0].data();
            console.log(responseUser);

            this.saveUserSesion({
              ...{
                uid: u.uid,
                idUser: null,
                userName: u.displayName,
                avatar: u.photoURL,
                email: u.email
              },
              ...responseUser
            })
            this.userSesion.next({
              ...{
                uid: u.uid,
                idUser: null,
                userName: u.displayName,
                avatar: u.photoURL,
                email: u.email
              },
              ...responseUser
            });
          } catch (error) {
            console.log(error);

          }

        }

        this.router.navigate(['/chat-list'], { replaceUrl: true });

      } else {

        this.removeStorage();
        this.userSesion.next(null);
        this.router.navigateByUrl('login')

      }


      console.log(this.userSesion.value);


    });
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }


  loginAnonimous(): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInAnonymously();
  }

  async logout() {
    return await this.afAuth.auth.signOut();
  }

  saveUserSesion(userToStorage) {
    this.storage.set('user', JSON.stringify(userToStorage));
  }

  async getUserFromStorage() {
    return JSON.parse(await this.storage.get('user')) as iUser;
  }

  async removeStorage(){
    return await this.storage.clear();
  }

}