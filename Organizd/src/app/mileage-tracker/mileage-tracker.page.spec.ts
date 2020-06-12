import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MileageTrackerPage } from './mileage-tracker.page';

describe('MileageTrackerPage', () => {
  let component: MileageTrackerPage;
  let fixture: ComponentFixture<MileageTrackerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageTrackerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MileageTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
