import { AuthService } from './../services/auth.service';
import { iUser } from './../chat-list/model/user.model';
import { Observable, observable } from 'rxjs';
import { DbService } from './../services/db.service';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-select-user-to-chat',
  templateUrl: './select-user-to-chat.page.html',
  styleUrls: ['./select-user-to-chat.page.scss'],
})
export class SelectUserToChatPage implements OnInit {

  users: Observable<iUser[]>;
  usersFiltered : iUser[] = [];

  constructor(private db: DbService, private auth: AuthService,
    private chatService : ChatService) { }

  ngOnInit() {

    if (this.auth.userSesion.value) {
      this.users = this.db.getUsers(this.auth.userSesion.value);
      this.users.subscribe(users => {
        console.log('tengo estos users', users);     

        this.usersFiltered = users.filter((element) => {
          return element.idUser != this.auth.userSesion.value.idUser;
        });
      });
    }

  }

  async initChat(user: iUser) {

    const userC = this.auth.userSesion.value;
    
    // TODO:Create Chat

    this.chatService.createChat(userC, user , 'user'); //actualmente se manda 'user' como el tipo pero se podria mandar el tipo del usuario que no esta creando el chat

    console.log(user);

  }

}
