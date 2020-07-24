import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { map, share, first } from 'rxjs/operators';
import { Client } from '../models/client';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.page.html',
  styleUrls: ['./client-detail.page.scss'],
})
export class ClientDetailPage implements OnInit {

  state: Client;
  selected: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private clientService: ClientService) { }

  ngOnInit() {
    //this.state = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state = this.router.getCurrentNavigation().extras.state;
    this.selected = this.state.process;
  }

  optionChanged(selectedValue: any){
    this.selected = selectedValue.detail.value;
    this.clientService.updateStatus(this.state.ClientID, this.selected)
          .pipe(first())
          .subscribe(
            resData => {
              
            },
            errRes => {
              
            }
          );
  }

}
