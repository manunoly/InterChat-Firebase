import { iUser } from './../chat-list/model/user.model';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UtilService } from './../services/util.service';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from './../services/db.service';

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.page.html',
  styleUrls: ['./user-crud.page.scss'],
})
export class UserCrudPage implements OnInit {
  users;
  // users: Observable<iUser[]>;
  userType;

  constructor(
    private db: DbService,
    private auth: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userType = this.db.userType$;
    this.getUserFromDatabase('user');
  }

  async getUserFromDatabase(type) {
    try {
      this.users = [
        {
          idUser: 'Manuel Ramon',
          uid: '1',
          userName: '1',
          avatar: '',
          type: '1',
          email: '1',
        },

        {
          idUser: 'Javier jsp',
          uid: '2',
          userName: '2',
          avatar: '',
          type: '2',
          email: '2',
        },
      ];
    } catch (error) {
      console.log(error);
    }
  }

  async edit(user) {}

  async delete(user) {}

  trackByID(user: iUser) {
    return user.uid ? user.uid : user.email;
  }
}
