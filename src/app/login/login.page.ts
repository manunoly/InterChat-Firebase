import { UtilService } from './../services/util.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

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

  constructor(
    public auth: AuthService,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit() {}

  async login() {
    this.errorMsg = 'Please Wait';
    this.utilService.showLoading();
    try {
      const response = await this.auth.login(this.email, this.password);
      this.utilService.showLoading();
      console.log(response);
      this.router.navigate(['chat-list'], { replaceUrl: true });
      this.email = undefined;
      this.password = undefined;
    } catch (error) {
      console.log(error);
      this.utilService.dismissLoading();

      this.errorMsg =
        error && error.message ? error.message : 'Upps... please try again!';
      setTimeout(() => {
        this.errorMsg = '';
      }, 5000);
    }
  }

  // async register(){
  //   const modal = await this.modalController.create({
  //     component: RegisterPage,
  //     componentProps: { }
  //   });
  //   modal.onDidDismiss()
  //     .then((data) => {
  //      console.log(data);
  //     });
  //   return await modal.present();

  // }

  logout() {
    this.auth.logout();
  }
}
