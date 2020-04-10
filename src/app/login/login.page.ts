import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email;
  password;
  errorMsg;
  loading = false;
  user;

  constructor(public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
  }


  async login() {
    this.errorMsg = 'Please Wait';
    this.loading = true;
    try {
      const response = await this.auth.login(this.email, this.password);
      this.loading = false;
      console.log(response);
      this.router.navigate(['chat-list'] , {replaceUrl: true});
      this.email = undefined;
      this.password = undefined;

    } catch (error) {
      console.log(error);
      this.loading = false;
      this.errorMsg = error && error.message ? error.message : 'Upps... please try again!'
      setTimeout(() => {
        this.errorMsg = '';
      }, 5000);
    }
    // setTimeout(() => {
    //   this.errorMsg = '';
    // }, 400);
  }

  logout(){
    this.auth.logout();
  }
}
