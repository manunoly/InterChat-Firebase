import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserCrudPage } from './user-crud.page';

describe('UserCrudPage', () => {
  let component: UserCrudPage;
  let fixture: ComponentFixture<UserCrudPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCrudPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
