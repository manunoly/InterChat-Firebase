import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';

import {AutosizeModule} from 'ngx-autosize';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { TimeFormatPipe } from 'src/app/_pipes/time-format.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicRatingModule } from 'ionic-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    AutosizeModule,
    NgxIonicImageViewerModule,
    SharedModule,
    IonicRatingModule
  ],
  declarations: [
    ChatPage,
    TimeFormatPipe
  ]
})
export class ChatPageModule {}
