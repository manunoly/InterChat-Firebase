import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectUserToChatPageRoutingModule } from './select-user-to-chat-routing.module';

import { SelectUserToChatPage } from './select-user-to-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectUserToChatPageRoutingModule
  ],
  declarations: [SelectUserToChatPage]
})
export class SelectUserToChatPageModule {}
