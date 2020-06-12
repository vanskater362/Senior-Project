import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MilesTrackerListPage } from './miles-tracker-list.page';

const routes: Routes = [
  {
    path: '',
    component: MilesTrackerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MilesTrackerListPageRoutingModule {}
