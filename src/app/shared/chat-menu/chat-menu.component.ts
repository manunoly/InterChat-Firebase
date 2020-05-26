import { Component, OnInit, Input } from '@angular/core';
import { iUser } from 'src/app/chat-list/model/user.model';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalUserInfoComponent } from '../modal-user-info/modal-user-info.component';
import { UtilService } from 'src/app/services/util.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalTransferChatSupportComponent } from '../modal-transfer-chat-support/modal-transfer-chat-support.component';

@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent implements OnInit {

  @Input() typeUser : string;
  @Input() userInfoToShow : iUser;
  @Input() statusChat : string;

  constructor(private popoverController: PopoverController,
    private modalController : ModalController,
    private utilService : UtilService,
    private chatService: ChatService,
    private authService: AuthService) {}

  ngOnInit() {
    // console.log(this.typeUser);
    // console.log(this.userInfo);
  }

 async showInfoUser(){
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: ModalUserInfoComponent,
      componentProps: {
       userInfo : this.userInfoToShow
      }
    });
    return await modal.present();

  }

 async transferActiveChat(){
    this.popoverController.dismiss();

    const modal = await this.modalController.create({
      component: ModalTransferChatSupportComponent,
      componentProps: {
       chatSelected : this.chatService.chatData
      }
    });
    return await modal.present();

  }

  async finalizeActiveChat(){
    this.popoverController.dismiss();

    const confirm = await this.utilService.showAlertConfirmAction('ATENTION' , 'Are you sure you want to close this chat?');

    if(confirm){
      try {
        await this.chatService.closeActiveSupportChat(this.chatService.chatData.idChat , this.authService.userSesion.value);
      } catch (error) {
        console.log(error);        
      }
      
    }

  }

}
