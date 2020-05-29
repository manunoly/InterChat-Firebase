import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GivbuxLoginPage } from './givbux-login.page';

const routes: Routes = [
  {
    path: '',
    component: GivbuxLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GivbuxLoginPageRoutingModule {}
