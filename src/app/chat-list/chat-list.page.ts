import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {

  chatData: Array<any> = [];

  constructor(private router : Router) {

    // this.loadChatData();
    
   }

  ngOnInit() {

  }

  openChat(selectedChat){
    console.log(selectedChat);
    this.router.navigate(['chat']);
  }

  loadChatData(){
    this.chatData = [
    {
      "name": 'Jovenica',
      "image": './assets/img/chat/user.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'online',
      "count": '2',
      "time": '2 min ago'

    }, {
      "name": 'Oliver',
      "image": ' ./assets/img/chat/user3.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "badge": '4',
      "sendTime": '18:34',
      "group": true

    }, {
      "name": 'George',
      "image": ' ./assets/img/chat/user4.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "count": '2',
      "sendTime": '18:30',
      "broadcast": true

    }, {
      "name": 'Harry',
      "image": ' ./assets/img/chat/user1.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'online',
      "badge": '6',
      "sendTime": '17:55'
    }, {
      "name": 'Jack',
      "image": ' ./assets/img/chat/user.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "sendTime": '17:55'
    }, {
      "name": 'Jacob',
      "image": ' ./assets/img/chat/user3.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "count": '1',
      "sendTime": '17:50'
    }, {
      "name": 'Noah',
      "image": ' ./assets/img/chat/user2.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "sendTime": '17:40'
    }, {
      "name": 'Charlie',
      "image": ' ./assets/img/chat/user4.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'online',
      "count": '6',
      "badge": '8',
      "sendTime": '17:40'
    }, {
      "name": 'Logan',
      "image": ' ./assets/img/chat/user.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "badge": '8',
      "sendTime": '17:40'
    }, {
      "name": 'Harrison',
      "image": ' ./assets/img/chat/user2.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "sendTime": '17:40'
    }, {
      "name": 'Sebastian',
      "image": ' ./assets/img/chat/user1.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'online',
      "sendTime": '17:40'
    }, {
      "name": 'Zachary',
      "image": ' ./assets/img/chat/user4.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "sendTime": '17:40'
    }, {
      "name": 'Elijah',
      "image": ' ./assets/img/chat/user3.jpeg',
      "description": ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
      "status": 'offline',
      "badge": '8',
      "sendTime": '17:40'
    }
    ]
  }

}
