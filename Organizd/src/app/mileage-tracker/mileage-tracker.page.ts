import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { Trip } from '../models/trip.model';
import { User } from '../models/user';
import { get } from '@ionic-native/core/decorators/common';
import * as moment from 'moment'; 
import { MilesService } from '../services/miles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mileage-tracker',
  templateUrl: './mileage-tracker.page.html',
  styleUrls: ['./mileage-tracker.page.scss'],
})
export class MileageTrackerPage implements OnInit {
  isLoading = false;
  //private tripListSubject: BehaviorSubject<Array<Trip>>;
  //currentTrips: Observable<Array<Trip>>;
  public tripList = new Array<Trip>();

  tripData: Trip = {
    MilageID: '',
    Beginning: '',
    Ending: '',
    total: null,
    Date: null,
    UserID: ''
  };
  registerSub: Subscription;
  //user: User;
  user = JSON.parse(localStorage.getItem("currentUser"));

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private milesService: MilesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  getUserID(){
    var result = localStorage.getItem("currentUser");
    result = result.replace(/(^\[)/, '');
    result = result.replace(/(\]$)/, '');
    try {
      var resultObj = JSON.parse(result);
    } catch (e) {
      console.log("Error, not a valid JSON string");
    }
    return resultObj["UserID"];
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.registerSub) {
      this.registerSub.unsubscribe();
    }

    this.tripData.Beginning = form.value.from;
    this.tripData.Ending = form.value.to;
    this.tripData.total = form.value.totalMiles;
    this.tripData.Date = form.value.date;
    this.tripData.UserID = this.getUserID();

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Submitting Mileage...' })
      .then(loadingEl => {
        loadingEl.present();
        this.registerSub = this.milesService.subMiles(this.tripData).subscribe(
          resData => {
            
            loadingEl.dismiss();
            form.reset();
          },
          errRes => {
            loadingEl.dismiss();
            const message = errRes.error.message;
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Submitting Trip failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  todayList(){
    const curDate = moment().format('YYYY-MM-DD');
    const userID = this.getUserID();
    const time = "today";
    this.router.navigate(['/mileage-tracker/miles-tracker-list'], {
      queryParams: { userId: userID, date: `Date="${curDate}"`, time: time }
    });
  }

  weekList(){
    const curDate = "(SELECT YEARWEEK(Date)= YEARWEEK(NOW()))";
    const userID = this.getUserID();
    const time = "this week";
    this.router.navigate(['/mileage-tracker/miles-tracker-list'], {
      queryParams: { userId: userID, date: curDate, time: time }
    });
  }

  monthList(){
    const curDate = "(SELECT MONTH(Date)= MONTH(NOW()))";
    const userID = this.getUserID();
    const time = "this month";
    this.router.navigate(['/mileage-tracker/miles-tracker-list'], {
      queryParams: { userId: userID, date: curDate, time: time }
    });
  }

  yearList(){
    const curDate = "(SELECT YEAR(Date)= YEAR(NOW()))";
    const userID = this.getUserID();
    const time = "this year";
    this.router.navigate(['/mileage-tracker/miles-tracker-list'], {
      queryParams: { userId: userID, date: curDate, time: time }
    });
  }

}
