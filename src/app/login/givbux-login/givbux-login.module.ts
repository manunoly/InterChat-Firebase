import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GivbuxLoginPageRoutingModule } from './givbux-login-routing.module';

import { GivbuxLoginPage } from './givbux-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GivbuxLoginPageRoutingModule
  ],
  declarations: [GivbuxLoginPage]
})
export class GivbuxLoginPageModule {}
