import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { UtilService } from '../services/util.service';

import { iChat } from './model/chat.model';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {

  chats: Observable<iChat[]>;
  offline:Observable<boolean>;

  constructor(private router: Router,
    private chatService: ChatService,
    public utilService: UtilService) { }

  ngOnInit() {
    this.chats = this.chatService.chatData$;
    this.offline = this.chatService.offlineData$;
  }

  openChat(selectedChat) {
    console.log(selectedChat);
    this.chatService.setChatData(selectedChat);
    this.router.navigate(['chat']);
  }

  reloadChatData(){
    
    // TODO:how to reload data

  }


}
