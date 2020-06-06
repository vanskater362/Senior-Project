import { Component, OnInit } from '@angular/core';
import { Trip } from '../models/trip.model';

@Component({
  selector: 'app-miles-tracker-list',
  templateUrl: './miles-tracker-list.page.html',
  styleUrls: ['./miles-tracker-list.page.scss'],
})
export class MilesTrackerListPage implements OnInit {
  trips: Trip[] = [
    {
      id: '1',
      from: 'Home',
      to: 'Jane\'s',
      date: new Date(),
      total: 32
    },
    {
      id: '2',
      from: 'Home',
      to: 'John\'s',
      date: new Date(),
      total: 41
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
