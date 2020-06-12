import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MileageTrackerPage } from './mileage-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: MileageTrackerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MileageTrackerPageRoutingModule {}
