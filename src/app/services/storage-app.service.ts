import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { iUser } from '../chat-list/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageAppService {

  constructor(private storage: Storage) { }

  /**
   * Save locally Contacts from one User on the app
   * @param idUserSesion 
   * @param dataContacts 
   */
  setContactsUser(idUserSesion: string, dataContacts: iUser[]) {
    this.storage.set(idUserSesion, JSON.stringify(dataContacts));
  }

 /**
  * Get Users Contacts from Storage
  * @param idUserSesion 
  * @return iUser[] | null
  */
  async getContactsUser(idUserSesion: string) : Promise<iUser[] | null> {
    return JSON.parse(await this.storage.get(idUserSesion)) as iUser[] | null;
  }


}
