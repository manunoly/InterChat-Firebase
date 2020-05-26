import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserCrudPage } from './user-crud.page';

const routes: Routes = [
  {
    path: '',
    component: UserCrudPage
  },
  {
    path: 'user-detail',
    loadChildren: () => import('./user-detail/user-detail.module').then( m => m.UserDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCrudPageRoutingModule {}
