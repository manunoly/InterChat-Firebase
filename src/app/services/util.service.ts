import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase/app';
import { LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public readonly version = 'V-1.0.0';
  loading: any;
  private today = new Date();
  preferedDarkTheme = false;
  // size in byte
  public imageMaxSize = 1 * 1000000;

  constructor(private storage: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform,
    private _navigation: Location) {

    this.loadTheme();

  }

  async showLoading(msg = 'Please wait') {
    this.loading = await this.loadingController.create({
      message: msg,
      duration: 19000
    });
    await this.loading.present();
    return this.loading;
  }

  async dismissLoading() {
    try {
      if (this.loading)
        await this.loading.dismiss();
    } catch (error) { console.log(error); }
  }

  async showAlert(title: string, subtitle: string = '', message: string = '', buttonsD = ['Accept']) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: message,
      buttons: buttonsD
    });

    await alert.present();
  }

  async showAlertConfirmAction(header: string, subHeader: string, message: string = '' , btnLabels : string[] = ['Accept' , 'Cancel']): Promise<boolean> {

    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });

    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: btnLabels[0],
          cssClass: 'secondary',
          handler: () => {
            resolveFunction(true)
          }
        },
        {
          text: btnLabels[1],
          role: 'cancel',
          handler: () => {
            console.log('alert Cancel');
            resolveFunction(false)
          }
        }
      ]
    });

    await alert.present();
    return promise;

  }

  async showToast(message: string , duration : number = 1500) {

    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();

  }

  async showToastNewMessageRecieved(nameSender: string, message: string) {

    const toast = await this.toastController.create({
      header: `Message From ${this.toTitleCase(nameSender)}`,
      message: `${message}`,
      duration: 1500,
      position: "top",
      cssClass: 'toastChat'
    });
    toast.present();

  }

  saveUserSesion(userToStorage) {
    this.storage.set('user', JSON.stringify(userToStorage));
  }

  async getUserFromStorage() {
    return JSON.parse(await this.storage.get('user'));
  }

  async setKeyStorage(key: string, data) {
    return await this.storage.set(key, JSON.stringify(data));
  }
  async getKeyStorage(key: string) {
    return JSON.parse(await this.storage.get(key));
  }

  async removeKeyStorage(key: string) {
    return await this.storage.remove(key);
  }

  async removeALLStorage() {
    return await this.storage.clear();
  }

  get serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get timestampServerNow() {
    return firebase.firestore.Timestamp.now();
  }

  calendarDayFormat(dateRef: Date) {
    return moment(dateRef).calendar(this.today, {
      sameDay: '[Today]',
      nextDay: 'DD/MM/YYYY',
      nextWeek: 'DD/MM/YYYY',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

  isDifferentDayFromToday(dateToCheck: Date): boolean {
    return moment(dateToCheck).isSame(this.today, 'day');
  }

  timeFromNow(dateToCheck: Date) {
    return moment(dateToCheck).fromNow()
  }

  getInstanceFirebase() {
    return firebase
  }

  /**
   * Create new TimeStamp Firebase
   * @param seconds 
   * @param nanoseconds 
   * @return firebase.firestore.Timestamp
   */
  newTimeStampFirestore(seconds: number, nanoseconds: number) {
    return new firebase.firestore.Timestamp(seconds, nanoseconds)
  }

  unsubscribeFrom(subscriptions: Subscription[]) {
    if (subscriptions) {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
    }
  }

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  isCordova(): boolean {
    return this.platform.is('cordova');
  }

  getMimeType(fileExt: string) {

    if (fileExt == 'wav') return { type: 'audio/wav', messageType: 'audio' };
    else if (fileExt == 'm4a') return { type: 'audio/m4a', messageType: 'audio' };
    else if (fileExt == 'jpg') return { type: 'image/jpg', messageType: 'image' };
    else if (fileExt == 'jpeg') return { type: 'image/jpeg', messageType: 'image' };
    else if (fileExt == 'png') return { type: 'image/png', messageType: 'image' };
    else if (fileExt == 'mp4') return { type: 'video/mp4', messageType: 'video' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime', messageType: 'video' };
    else {
      // Document | file
      return { type: '', messageType: 'file' };
    }
  }

  /**
   * 
   * @param typeInput 'image' | 'document'
   * @returns string accepted miMeType like https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   */
  acceptedMimeTypes(typeInput: string): string {

    if (typeInput == 'image' || typeInput == 'gallery')
      return 'image/png, image/jpeg, image/jpg'
    else if (typeInput == 'document')
      return `application/pdf, application/x-pdf, application/acrobat, applications/vnd.pdf, text/pdf, text/x-pdf, 
      .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
      .csv, .xlsx, .application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
      .ppt, .pptx, .application/vnd.openxmlformats-officedocument.presentationml.presentation,
      text/plain, 
      application/json,
      application/rar,
      application/zip, application/x-zip, application/x-zip-compressed, application/octet-stream, application/x-compress, application/x-compressed, multipart/x-zip`

  }

  srcFallBackImg(event, urlBackup = './assets/icon/favicon.png' ){
    event.target.src = urlBackup; 
  }

  async loadTheme() {
    console.log('Loading Setting Theme...');
    const resolveTheme = await this.getKeyStorage('DarkTheme');
    if (resolveTheme) {
      this.preferedDarkTheme = resolveTheme;
      document.body.classList.toggle('dark', this.preferedDarkTheme);
    } else if (resolveTheme == null) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        this.toggleTheme();
    }

  }

  toggleTheme() {
    console.log('toggle Theme');
    this.preferedDarkTheme = !this.preferedDarkTheme;
    document.body.classList.toggle('dark', this.preferedDarkTheme);
    this.setKeyStorage('DarkTheme', this.preferedDarkTheme);

  }

  backOnNavigation(){
      this._navigation.back();
  }
}
