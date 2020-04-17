import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalImagePage } from './modal-image.page';

describe('ModalImagePage', () => {
  let component: ModalImagePage;
  let fixture: ComponentFixture<ModalImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
