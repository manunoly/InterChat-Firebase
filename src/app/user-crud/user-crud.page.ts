import { map, shareReplay } from 'rxjs/operators';
import { UserService } from './../services/user.service';
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
  users = [];
  // users: Observable<iUser[]>;
  userType;
  loadingProcess = false;

  constructor(
    private db: DbService,
    private auth: AuthService,
    private utilService: UtilService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userType = this.db.userType$;
    this.getUserFromDatabase(this.userType[0]['id']);
  }

  async getUserFromDatabase(type?) {
    try {
      this.loadingProcess = true;
      this.users = [];
      console.log('el type', type);

      this.userService.getUsersByTypeObservable(type).subscribe((user) => {
        this.users = user;
        this.loadingProcess = false;
      });

      return console.log(this.users);
    } catch (error) {
      this.loadingProcess = false;
      console.log(error);
    }
  }

  async edit(user) {}

  async delete(user: iUser) {
    if (
      user &&
      user.uid &&
      (await this.utilService.showAlertConfirmAction(
        'Atention',
        'Are you sure you want to delete?'
      ))
    ) {
      try {
        await this.db.delete(`users/${user.uid}`);

        this.utilService.showAlert('Information', 'User deleted');
        // TODO:Check if delete user from DB or just disabled
      } catch (error) {
        this.utilService.showAlert('Error', 'Error deleting user');

      }
    }
  }

  trackByID(user: iUser) {
    return user.uid ? user.uid : user.email;
  }
}
