import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallCenterChatListPageRoutingModule } from './call-center-chat-list-routing.module';

import { CallCenterChatListPage } from './call-center-chat-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallCenterChatListPageRoutingModule
  ],
  declarations: [CallCenterChatListPage]
})
export class CallCenterChatListPageModule {}
