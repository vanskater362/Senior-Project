import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { ClientService } from '../services/client.service'

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {

  public addClient: Client = {
    FirstName: '',
    LastName: '',
    EMAIL: '',
    PHONE: 0,
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: 0,
    UserID: '',
    process: 0
  }
  registerSub: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private clientService: ClientService
  ) { }

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

    this.addClient.FirstName = form.value.firstName;
    this.addClient.LastName = form.value.lastName;
    this.addClient.address1 = form.value.address1;
    this.addClient.address2 = form.value.address2;
    this.addClient.city = form.value.city;
    this.addClient.state = form.value.state;
    this.addClient.zip = form.value.zip;
    this.addClient.EMAIL = form.value.email;
    this.addClient.PHONE = form.value.tel;
    this.addClient.process = 2;
    this.addClient.UserID = this.getUserID();

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Adding new Client...' })
      .then(loadingEl => {
        loadingEl.present();
        this.registerSub = this.clientService.subClient(this.addClient).subscribe(
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
        header: 'Adding new client failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
