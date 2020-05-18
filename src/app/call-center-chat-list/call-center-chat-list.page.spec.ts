import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CallCenterChatListPage } from './call-center-chat-list.page';

describe('CallCenterChatListPage', () => {
  let component: CallCenterChatListPage;
  let fixture: ComponentFixture<CallCenterChatListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterChatListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CallCenterChatListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
