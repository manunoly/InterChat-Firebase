import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectUserToChatPage } from './select-user-to-chat.page';

describe('SelectUserToChatPage', () => {
  let component: SelectUserToChatPage;
  let fixture: ComponentFixture<SelectUserToChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUserToChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectUserToChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
