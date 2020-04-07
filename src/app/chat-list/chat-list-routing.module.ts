import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatListPage } from './chat-list.page';

const routes: Routes = [
  {
    path: '',
    component: ChatListPage
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatListPageRoutingModule {}
