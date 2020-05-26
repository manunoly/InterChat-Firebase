import { Component, OnInit, Input } from '@angular/core';
import { iChat } from 'src/app/chat-list/model/chat.model';
import { iUser } from 'src/app/chat-list/model/user.model';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-transfer-chat-support',
  templateUrl: './modal-transfer-chat-support.component.html',
  styleUrls: ['./modal-transfer-chat-support.component.scss'],
})
export class ModalTransferChatSupportComponent implements OnInit {

  @Input() chatSelected : iChat;

  selectedUserCallCenter : iUser;
  usersCallCenter : iUser[] = [];
  loadingUsers = false;

  constructor(private modalController : ModalController,
    private authService: AuthService,
    private dbService: DbService,
    private chatService: ChatService,
    private utilService : UtilService) { }

  async ngOnInit() {

    try {

      this.loadingUsers = true;
      
      const responseDocument = await this.dbService.getUsersByType('callcenter');

      responseDocument.forEach((userCallCenter) => {
       this.usersCallCenter.push(userCallCenter.data() as iUser);        
      });

      console.log('=========== Users CallCenter ===========');
      console.log(this.usersCallCenter);

      this.usersCallCenter = this.usersCallCenter.filter((element) => {
        return element.idUser != this.authService.userSesion.value.idUser;
      });

      this.loadingUsers = false;

    } catch (error) {
      console.log(error);
      this.loadingUsers = true;
      this.utilService.showAlert('ERROR' , 'An error has occurred retrieving users data'); 
      this.close();     
    }

  }

  async transferChat(){


    const confirm = await this.utilService.showAlertConfirmAction('CHAT TRANSFER' , `Are you sure you want to transfer this chat to ${this.selectedUserCallCenter.userName}? `)

    if(confirm){

      try {
       
       const result = await this.chatService.transferActiveChatSupport(this.chatSelected, this.selectedUserCallCenter);

       console.log('========= RESULT CHAT TRANSFER =========');
       console.log(result);
   
       if(result){
         this.close();
         this.utilService.backOnNavigation();
       }
   
      } catch (error) {
        console.log(error);     
      }

    }


  }

  close(){
    this.modalController.dismiss();
  }

}
