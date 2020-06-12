import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { Trip } from 'src/app/models/trip.model';
import { User } from '../models/user';

@Component({
  selector: 'app-mileage-tracker',
  templateUrl: './mileage-tracker.page.html',
  styleUrls: ['./mileage-tracker.page.scss'],
})
export class MileageTrackerPage implements OnInit {

  tripData: Trip = {
    id: '',
    from: '',
    to: '',
    total: null,
    date: null,
    userID: ''
  };
  registerSub: Subscription;
  user = JSON.parse(localStorage.getItem("currentUser"));
  
  /*user = {
    FirstName: '',
    LastName: '',
    EMAIL: '',
    UserID: ''
  };*/
  
  

  constructor(
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.registerSub) {
      this.registerSub.unsubscribe();
    }

    var result = localStorage.getItem("currentUser");
    result = result.replace(/(^\[)/, '');
    result = result.replace(/(\]$)/, '');
    try {
      var resultObj = JSON.parse(result);
    } catch (e) {
      console.log("Error, not a valid JSON string");
    }
    
    this.tripData.from = form.value.from;
    this.tripData.to = form.value.to;
    this.tripData.total = form.value.totalMiles;
    this.tripData.date = form.value.date;
    this.tripData.userID = resultObj["UserID"];

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Submitting Mileage...' })
      .then(loadingEl => {
        loadingEl.present();
        this.registerSub = this.authService.subMiles(this.tripData).subscribe(
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
        header: 'Activation failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
