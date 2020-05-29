import { Injectable, NgZone } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { DbService } from './db.service';

import { UtilService } from './util.service';

import { iUser } from '../chat-list/model/user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseUser$: Observable<any>;
  userSesion: BehaviorSubject<iUser> = new BehaviorSubject(null);

  constructor(public afAuth: AngularFireAuth,
    private zone: NgZone,
    private router: Router,
    private dbService: DbService,
    private utilService: UtilService,
    private afs : AngularFirestore) {

    this.firebaseUser$ = this.afAuth.authState;
    // console.log(this.firebaseUser$);

    this.firebaseUser$.subscribe(async u => {

      console.log('User Firebase');
      console.log(u);
      // this.user = u;
      if (u) {

        const userLocalStorage = await this.utilService.getUserFromStorage();

        if (userLocalStorage) {

          this.userSesion.next(userLocalStorage);

        } else {

          try {
            console.log(u.email);

            // console.log((await this.dbService.getUser(u.email)).docs[0].data());
            const responseUser = (await this.dbService.getUser(u.email)).docs[0].data();           
            console.log(responseUser);

            this.utilService.saveUserSesion({
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
            this.utilService.showAlert('Information', 'A problem was ocurred on login. Please try again later');
            this.logout()
            this.router.navigate(['welcome'], { replaceUrl: true });

          }

        }

        this.router.navigate(['/chat-list'], { replaceUrl: true });

      } else { // Logout

        this.utilService.removeKeyStorage('user');
        this.userSesion.next(null);
        this.router.navigate(['welcome'], { replaceUrl: true });


      }


      // console.log(this.userSesion.value);


    });
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }


  loginAnonimous(): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInAnonymously();
  }

  async logout() {
    this.router.navigateByUrl('welcome' , {replaceUrl: true});
    return await this.afAuth.auth.signOut();
  }


  async register(data) {
    this.utilService.showLoading();

    try {
      const userD = await this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password);

      data.type = 'callcenter';

      const idUser = this.afs.createId();

      let user: iUser =
      {
        idUser: idUser,
        uid: userD.user.uid,
        userName: data.displayName ? data.displayName : "Automatic User",
        avatar: data.avatar ? data.avatar : "./assets/icon/favicon.png",
        type: data.type ? data.type : 'user',
        email: data.email ? data.email : "",
        phone: data.phone ? data.phone : "",
      }

      await this.dbService.updateCreateAt('users/' + idUser ,user);

      this.utilService.dismissLoading();

      return true;
    } catch (error) {
      this.utilService.dismissLoading();
      this.utilService.showAlert('Unexpected error');
      return false;
    }
  }

}