import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectUserToChatPage } from './select-user-to-chat.page';

const routes: Routes = [
  {
    path: '',
    component: SelectUserToChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectUserToChatPageRoutingModule {}
