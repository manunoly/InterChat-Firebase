import { AuthService } from './../services/auth.service';
import { iUser } from './../chat-list/model/user.model';
import { Observable, observable } from 'rxjs';
import { DbService } from './../services/db.service';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { StorageAppService } from '../services/storage-app.service';

@Component({
  selector: 'app-select-user-to-chat',
  templateUrl: './select-user-to-chat.page.html',
  styleUrls: ['./select-user-to-chat.page.scss'],
})
export class SelectUserToChatPage implements OnInit {

  users: Observable<iUser[]>;
  usersFiltered : iUser[] = [];

  loadingUsers = false;

  constructor(private db: DbService, private auth: AuthService,
    private chatService : ChatService,
    private utilService : UtilService,
    private router : Router,
    private storageApp : StorageAppService) { }

  async ngOnInit() {

    if (this.auth.userSesion.value) {

      this.loadingUsers = true;

      // this.users = this.db.getUsers(this.auth.userSesion.value);
      // this.users.subscribe(users => {
      //   console.log('tengo estos users', users);     

      //   this.usersFiltered = users.filter((element) => {
      //     return element.idUser != this.auth.userSesion.value.idUser;
      //   });

      //   this.loadingUsers = false;
      // });

      try {

        const usersFromStorage = await this.storageApp.getContactsUser(this.auth.userSesion.value.idUser);

        if(usersFromStorage){

          this.usersFiltered = usersFromStorage;
          this.loadingUsers = false;

        } else {

         this.getUserFromDatabase()

        }    


      } catch (error) {
        this.loadingUsers = false;
        console.log(error);
        
      }      

    }

  }

  async initChat(user: iUser) {

    const userC = this.auth.userSesion.value;
    
    // TODO:Create Chat

    try {                                             
      this.utilService.showLoading();
      //actualmente se manda 'user' como el tipo pero se podria mandar el tipo del usuario que no esta creando el chat

      const responseChat = await this.chatService.createChat(userC, user , 'user');

      console.log(responseChat);     

      this.utilService.dismissLoading();
      
      this.router.navigate(['chat']);

     

    } catch (error) {
      console.log(error);
      this.utilService.dismissLoading();
    }
  

    console.log(user);

  }

 async getUserFromDatabase(){

    this.loadingUsers = true;

    try {

      let responseUsers = await this.db.getUsersOneTime();
      this.usersFiltered = [];
      responseUsers.forEach((doc) => { // Get() Promise Version      
        this.usersFiltered.push({ idUser: doc.id , avatar: '' , userName: '' , ...doc.data() })
      });
  
       this.usersFiltered = this.usersFiltered.filter((element) => {
        return element.idUser != this.auth.userSesion.value.idUser;
      });
  
      // Set data on Storage
      this.storageApp.setContactsUser(this.auth.userSesion.value.idUser, this.usersFiltered);
      this.loadingUsers = false;
    
      
    } catch (error) {
      this.loadingUsers = false;
      console.log(error); 
    }
 
  }

}
