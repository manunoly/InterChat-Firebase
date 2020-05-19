import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected apiUrl : string;

  constructor(private http : HttpClient) {

    this.apiUrl = environment.apiUrl;
   }


  pushNotificationChat(id_user : string, name : string, message : string, id_user_send : string){
    let url = this.apiUrl + "pushnotificationchat";
    // let header = this.getHeaders();

    return this.http.post(url, { id_user , name , message , id_user_send }).toPromise();
  }
}
