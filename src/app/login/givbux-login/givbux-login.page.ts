import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from './../../services/util.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-givbux-login',
  templateUrl: './givbux-login.page.html',
  styleUrls: ['./givbux-login.page.scss'],
})
export class GivbuxLoginPage implements OnInit {
  typeP = 'password';
  email;
  pin;
  errorMsg;
  loading = false;

  constructor(
    private api: ApiService,
    private utilService: UtilService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  async login() {
    try {
      const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

      if (!emailRegex.test(this.email)) {
        return this.utilService.showAlert('Please provide a valid email');
      }
      this.utilService.showLoading();

      const resp = await this.api.isMailGivbux(this.email);
      console.log(resp)
      if (resp && !resp['error'] && resp['data']) {
        if (resp['data']['ping'] != this.pin) {
          this.utilService.dismissLoading();
          return this.utilService.showAlert('Your pin is not right');
        }

        await this.auth.login(this.email, resp['data']['id'] + resp['data']['ping']);

        setTimeout(() => {
          this.email = undefined;
          this.pin = undefined;
          this.utilService.dismissLoading();
        }, 500);

        this.router.navigate(['chat-list'], { replaceUrl: true });
      } else {
        this.utilService.dismissLoading();
        return this.utilService.showAlert(resp['message'] ? resp['message'] : 'Please check your data');
      }
    } catch (error) {
      setTimeout(() => {
        this.utilService.dismissLoading();
      }, 100);
      if (error && error.user == false)
        return this.utilService.showAlert('Your pin is not right');
      this.utilService.showAlert(
        'Info',
        'Error in the process. Check your data and try again'
      );
    }
  }
}
