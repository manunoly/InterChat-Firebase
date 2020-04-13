import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { iUser } from '../chat-list/model/user.model';

import * as firebase from 'firebase/app';
import { LoadingController, AlertController } from '@ionic/angular';

import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  loading: any;

  private today = new Date();

  constructor(private storage: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController) { }


  async showLoading(msg = 'Please wait') {
    this.loading = await this.loadingController.create({
      message: msg,
      duration: 19000
    });
    await this.loading.present();
  }

  async dismissLoading() {
    try {
      if (this.loading)
        await this.loading.dismiss();
    } catch (error) { console.log(error); }
  }

  async showAlert(title: string, subtitle: string = '', message: string = '' , buttonsD = ['Accept']) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: message,
      buttons: buttonsD
    });

    await alert.present();
  }

  saveUserSesion(userToStorage) {
    this.storage.set('user', JSON.stringify(userToStorage));
  }

  async getUserFromStorage() {
    return JSON.parse(await this.storage.get('user')) as iUser;
  }

  async removeKeyStorage(key: string) {
    return await this.storage.remove(key);
  }

  async removeStorage() {
    return await this.storage.clear();
  }

  get serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get timestampServerNow(){
    return firebase.firestore.Timestamp.now();
  }  

  calendarDayFormat(dateRef : Date) {
    return moment(dateRef).calendar(this.today, {
      sameDay: '[Today]',
      nextDay: 'DD/MM/YYYY',
      nextWeek: 'DD/MM/YYYY',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

  isDifferentDayFromToday(dateToCheck : Date): boolean {
    return moment(dateToCheck).isSame(this.today, 'day');
  }

}
