import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loginForm: FormGroup;
  typeP = 'password';

  constructor(private auth: AuthService, private modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  async close() {
    this.modalController.dismiss();
  }


  buildForm() {
    this.loginForm = new FormGroup({
      displayName: new FormControl('manuel', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      phone: new FormControl('111111111', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      email: new FormControl('manuel@gmail.com', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      passwordC: new FormControl('123456', [Validators.required, Validators.minLength(6), Validators.maxLength(100)])
    });
  }


  async register() {
    if (await this.auth.register(this.loginForm.value))
      this.close();

  }

}
