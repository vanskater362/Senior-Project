import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client';
import { AlertController, LoadingController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.page.html',
  styleUrls: ['./client-list.page.scss'],
})
export class ClientListPage implements OnInit {
  sliderConfig = {
    spaceBetween: 10,
    slidesPerView: 4.5
  }


  isLoading = false;
  clientList: Array<Client>;
  public activeList = new Array<Client>();
  public followList = new Array<Client>();
  public pausedList = new Array<Client>();
  public innactiveList = new Array<Client>();

  constructor( 
    private router: Router,
    private clientService: ClientService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    
    
  }

  ionViewWillEnter(){

    const userId = this.getUserID();
    this.getClients(userId);
  }

  splitList(clientList: Array<Client>) {
    this.activeList.length = 0;
    this.followList.length = 0;
    this.pausedList.length = 0;
    this.innactiveList.length = 0;
    clientList.forEach(element => {
      if (element.process === 1){ this.activeList.push(element); }
      if (element.process === 2){ this.followList.push(element); }
      if (element.process === 3){ this.pausedList.push(element); }
      if (element.process === 4){ this.innactiveList.push(element); }
    });
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

  getClients(userID: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Getting Clients...' })
      .then(loadingEl => {
        loadingEl.present();
        this.clientService.getClients(userID)
          .pipe(first())
          .subscribe(
            resData => {
              this.clientList = resData;
              if (Array.isArray(this.clientList) && this.clientList.length) {
                this.splitList(this.clientList);
              }
              loadingEl.dismiss();               
            },
            errRes => {
              loadingEl.dismiss();
              const message = 'No Clients Found.';
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

  clientDetail(client: Client) {
    this.router.navigate(['/client-detail'], { state: client });
  }

}
