import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MilesTrackerListPage } from './miles-tracker-list.page';

describe('MilesTrackerListPage', () => {
  let component: MilesTrackerListPage;
  let fixture: ComponentFixture<MilesTrackerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilesTrackerListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MilesTrackerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
