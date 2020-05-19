import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { iUser } from 'src/app/chat-list/model/user.model';

@Component({
  selector: 'app-modal-user-info',
  templateUrl: './modal-user-info.component.html',
  styleUrls: ['./modal-user-info.component.scss'],
})
export class ModalUserInfoComponent implements OnInit {

  @Input() userInfo : iUser;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.userInfo)
  }

  close(){
    this.modalController.dismiss();
  }

}
