import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMenuComponent } from './chat-menu/chat-menu.component';
import { ModalUserInfoComponent } from './modal-user-info/modal-user-info.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    ChatMenuComponent,
    ModalUserInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ChatMenuComponent,
    ModalUserInfoComponent
  ],
  entryComponents: [
    ChatMenuComponent,
    ModalUserInfoComponent
  ]
})
export class SharedModule { }
