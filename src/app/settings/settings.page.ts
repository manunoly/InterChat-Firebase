import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public utilService : UtilService) { }

  ngOnInit() {
  }


}
