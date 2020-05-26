import { DbService } from './db.service';
import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: [string][] = [];

  constructor(private db: DbService) {}

  async getUsersByType(type: string) {
    if (this.users && this.users[type]) return this.users[type];
    this.users[type] = this.db.getUsersByType(type);
    return this.users[type];
  }
}
