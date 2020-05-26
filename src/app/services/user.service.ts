import { Injectable } from '@angular/core';

import { iUser } from './../chat-list/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users:iUser;
  
  constructor() { }


}
