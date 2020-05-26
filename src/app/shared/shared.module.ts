import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMenuComponent } from './chat-menu/chat-menu.component';
import { ModalUserInfoComponent } from './modal-user-info/modal-user-info.component';
import { IonicModule } from '@ionic/angular';
import { ModalTransferChatSupportComponent } from './modal-transfer-chat-support/modal-transfer-chat-support.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatMenuComponent,
    ModalUserInfoComponent,
    ModalTransferChatSupportComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ChatMenuComponent,
    ModalUserInfoComponent,
    ModalTransferChatSupportComponent
  ],
  entryComponents: [
    ChatMenuComponent,
    ModalUserInfoComponent,
    ModalTransferChatSupportComponent
  ]
})
export class SharedModule { }
