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

  loadChatData() {

    // TODO: JAVIER decide si borras todo esto, creo ya no hace falta el boton de actualizar tampoco

    // this.loadingChats = true;


    // this.chats = this.chatService.getChats(this.authService.userSesion.value);
    // this.chats.subscribe(chats => {
    //   console.log('tengo estos chats', chats);   
    //   this.chatData = chats;
    //   chats.forEach(chat => {
    //     for (const iterator of chat.participantsMeta) {
    //       if(iterator.idUser != this.authService.userSesion.value.idUser){
    //         chat.avatarUserChat = iterator.avatar;
    //         chat.title = iterator.userName;

    //       }                   
    //     }          
    //   });

    //   this.loadingChats = false;
    // },

    // (errors) => {
    //   console.log(errors);

    // });

    // this.chatData = [
    // {
    //   "title": 'Jovenica',
    //   "avatarUserChat": './assets/img/chat/user.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'online',
    //   "count": '2',
    //   "updatedAt": '2 min ago', 

    // }, {
    //   "title": 'Oliver',
    //   "avatarUserChat": ' ./assets/img/chat/user3.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '18:34'

    // }, {
    //   "title": 'George',
    //   "avatarUserChat": ' ./assets/img/chat/user4.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "count": '2',
    //   "updatedAt": '18:30',

    // }, {
    //   "title": 'Harry',
    //   "avatarUserChat": ' ./assets/img/chat/user1.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'online',

    //   "updatedAt": '17:55'
    // }, {
    //   "title": 'Jack',
    //   "avatarUserChat": ' ./assets/img/chat/user.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '17:55'
    // }, {
    //   "title": 'Jacob',
    //   "avatarUserChat": ' ./assets/img/chat/user3.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "count": '1',
    //   "updatedAt": '17:50'
    // }, {
    //   "title": 'Noah',
    //   "avatarUserChat": ' ./assets/img/chat/user2.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '17:40'
    // }, {
    //   "title": 'Charlie',
    //   "avatarUserChat": ' ./assets/img/chat/user4.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'online',
    //   "count": '6',
    //   "updatedAt": '17:40'
    // }, {
    //   "title": 'Logan',
    //   "avatarUserChat": ' ./assets/img/chat/user.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '17:40'
    // }, {
    //   "title": 'Harrison',
    //   "avatarUserChat": ' ./assets/img/chat/user2.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '17:40'
    // }, {
    //   "title": 'Sebastian',
    //   "avatarUserChat": ' ./assets/img/chat/user1.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'online',
    //   "updatedAt": '17:40'
    // }, {
    //   "title": 'Zachary',
    //   "avatarUserChat": ' ./assets/img/chat/user4.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '17:40'
    // }, {
    //   "title": 'Elijah',
    //   "avatarUserChat": ' ./assets/img/chat/user3.jpeg',
    //   "lastMessage": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    //   "status": 'offline',
    //   "updatedAt": '17:40'
    // }
    // ]
  }

}
