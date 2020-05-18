import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallCenterChatListPage } from './call-center-chat-list.page';

const routes: Routes = [
  {
    path: '',
    component: CallCenterChatListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallCenterChatListPageRoutingModule {}
