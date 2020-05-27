import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserCrudPageRoutingModule } from './user-crud-routing.module';

import { UserCrudPage } from './user-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserCrudPageRoutingModule
  ],
  declarations: [UserCrudPage]
})
export class UserCrudPageModule {}
