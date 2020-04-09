import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseUser$: Observable<any>;

  constructor(public afAuth: AngularFireAuth) {
    this.firebaseUser$ = this.afAuth.authState;
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
}