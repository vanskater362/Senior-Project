import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MileageTrackerPageRoutingModule } from './mileage-tracker-routing.module';

import { MileageTrackerPage } from './mileage-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MileageTrackerPageRoutingModule
  ],
  declarations: [MileageTrackerPage]
})
export class MileageTrackerPageModule {}
