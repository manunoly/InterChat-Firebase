import { AuthService } from './../services/auth.service';
import { iUser } from './../chat-list/model/user.model';
import { Observable } from 'rxjs';
import { DbService } from './../services/db.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-user-to-chat',
  templateUrl: './select-user-to-chat.page.html',
  styleUrls: ['./select-user-to-chat.page.scss'],
})
export class SelectUserToChatPage implements OnInit {
  users: Observable<iUser[]>;

  constructor(private db: DbService, private auth: AuthService) { }

  ngOnInit() {
    this.users = this.db.getUsers();
    this.users.subscribe(user=>console.log('tengo estos users',user));
  }

  async initChat(user: iUser) {
    const userC = this.auth.firebaseUser$.toPromise();
    // TODO:Create Chat

    console.log(user);

  }

}
