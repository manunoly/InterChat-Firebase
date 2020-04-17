import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalImagePageRoutingModule } from './modal-image-routing.module';

import { ModalImagePage } from './modal-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalImagePageRoutingModule
  ],
  declarations: [ModalImagePage]
})
export class ModalImagePageModule {}
