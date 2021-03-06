import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';

import {AutosizeModule} from 'ngx-autosize';
import { ModalImagePageModule } from 'src/app/modals/modal-image/modal-image.module';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    AutosizeModule,
    NgxIonicImageViewerModule,
    ModalImagePageModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
