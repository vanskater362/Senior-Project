import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MilesTrackerListPageRoutingModule } from './miles-tracker-list-routing.module';

import { MilesTrackerListPage } from './miles-tracker-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MilesTrackerListPageRoutingModule
  ],
  declarations: [MilesTrackerListPage]
})
export class MilesTrackerListPageModule {}
