import { AngularFirestore } from '@angular/fire/firestore';
import { iUser } from './../../chat-list/model/user.model';
import { DbService } from './../../services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from './../../services/util.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  dataForm: FormGroup;
  id = null;
  user: iUser;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public db: DbService,
    private auth: AuthService,
    private afs: AngularFirestore,
    private utilService: UtilService
  ) {}

  async ngOnInit() {
    this.buildForm();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id != 'null') {
      const user = await this.db.doc$(`users/${this.id}`);
      this.dataForm.patchValue(user);
    } else {
      this.id = null;
    }
  }

  buildForm() {
    this.dataForm = this.fb.group({
      idUser: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      uid: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      avatar: [
        './assets/icon/favicon.png',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      type: [
        'user',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: [
        '@gmail.com',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  async submitData() {
    if (!this.id) {
      const id = this.afs.createId();
      this.dataForm.controls['idUser'].setValue(id);
      this.dataForm.controls['uid'].setValue(id);
    }
    console.log(this.dataForm.value);
    this.creteUpdate();
  }

  async creteUpdate() {
    await this.db.updateCreateAt(
      'users/' + this.dataForm.value.uid,
      this.dataForm.value
    );
  }
}
