import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GivbuxLoginPage } from './givbux-login.page';

describe('GivbuxLoginPage', () => {
  let component: GivbuxLoginPage;
  let fixture: ComponentFixture<GivbuxLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GivbuxLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GivbuxLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
