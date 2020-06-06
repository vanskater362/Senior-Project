import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Register } from 'src/app/models/register';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  isLoading = false;
  accountSuccess = false;
  registerData: Register = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  registerSub: Subscription;

  constructor( 
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { 
    this.accountSuccess = false;
  }

  ngOnInit() {
    this.accountSuccess = false;
  }

  ngOnDestroy() {
    if(this.registerSub) {
      this.registerSub.unsubscribe();
    }
    this.accountSuccess = false;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.registerSub) {
      this.registerSub.unsubscribe();
    }
    this.registerData.firstName = form.value.firstName;
    this.registerData.lastName = form.value.lastName;
    this.registerData.email = form.value.email;
    this.registerData.password = form.value.password;

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Activating account...' })
      .then(loadingEl => {
        loadingEl.present();
        this.registerSub = this.authService.register(this.registerData).subscribe(
          resData => {
            loadingEl.dismiss();
            this.accountSuccess = true;
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