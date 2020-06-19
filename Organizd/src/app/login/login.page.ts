import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication-service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { 
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/mileage-tracker']);
      }
  }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        this.authenticationService.login(email, password)
          .pipe(first())
          .subscribe(
            resData => {
              loadingEl.dismiss();
              document.location.href = '/mileage-tracker';
            },
            errRes => {
              loadingEl.dismiss();
              const message = 'Authentication Failed.';
              this.showAlert(message);
            }
          );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }
}

