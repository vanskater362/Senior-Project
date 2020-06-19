import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import * as moment from 'moment'; 
import { Trip } from '../../models/trip.model';
import { MilesService } from 'src/app/services/miles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-miles-tracker-list',
  templateUrl: './miles-tracker-list.page.html',
  styleUrls: ['./miles-tracker-list.page.scss'],
})
export class MilesTrackerListPage implements OnInit {
  isLoading = false;
  time: string;
  trips: Array<Trip>;/* = [
    {
      id: '1',
      from: 'Home',
      to: 'Jane\'s',
      date: moment().format('YYYY-MM-DD'),
      total: 32,
      userID: '1'
    },
    {
      id: '2',
      from: 'Home',
      to: 'John\'s',
      date: moment().format('YYYY-MM-DD'),
      total: 41,
      userID: '2'
    }
  ]*/

  constructor(
    private milesService: MilesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute) { }

  ngOnInit() {
    //this.milesService.currentTrips.subscribe(response => this.trips = response);
    //this.trips = this.milesService.currentTripsValue;
    const userId = this.route.snapshot.queryParams.userId;
    const date = this.route.snapshot.queryParams.date;
    this.time = this.route.snapshot.queryParams.time;
    this.getTrips(userId, date);
  }

  getTrips(userID: string, date: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Getting Trips...' })
      .then(loadingEl => {
        loadingEl.present();
        this.milesService.getTrips(userID, date)
          .pipe(first())
          .subscribe(
            resData => {
              this.trips = resData;
              loadingEl.dismiss();
              //document.location.href = '/mileage-tracker/miles-tracker-list';
            },
            errRes => {
              loadingEl.dismiss();
              const message = 'No Trips Found.';
              this.showAlert(message);
            }
          );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Finding Trips failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
