import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { map, share } from 'rxjs/operators';
import { Client } from '../models/client';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.page.html',
  styleUrls: ['./client-detail.page.scss'],
})
export class ClientDetailPage implements OnInit {

  state: Client;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    //this.state = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state = this.router.getCurrentNavigation().extras.state;
    console.log(this.state);
  }

}
