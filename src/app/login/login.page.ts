import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email;
  password;
  errorMsg;
  user;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.firebaseUser$.subscribe(u => this.user = u);
  }


  async login() {
    this.errorMsg = 'Please Wait';
    try {
      await this.auth.login(this.email, this.password);

    } catch (error) {
      this.errorMsg = error && error.message ? error.message : 'Upps... please try again!'
      setTimeout(() => {
        this.errorMsg = '';
      }, 5000);
    }
    setTimeout(() => {
      this.errorMsg = '';
    }, 400);
  }

  logout(){
    this.auth.logout();
  }
}
