import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class MilesService {
  /*private tripListSubject: BehaviorSubject<Array<Trip>>;
  currentTrips: Observable<Array<Trip>>;*/
  public tripList = [];
  public tripListSubject = new BehaviorSubject<Array<Trip>>(this.tripList);
  public currentTrips = this.tripListSubject.asObservable();

  headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          //.set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {
    
  }

  public get currentTripsValue(): Array<Trip> {
    return this.tripListSubject.value;
  }
   

  subMiles( input: Trip) {
    return this.http
      .post<boolean>(environment.apiUrl + '/miles/submit', input,{headers: this.headers})
      .pipe(share());
  }
  
  getTrips( userId: string, date: string){
    const params = new HttpParams()
    .set('userId', userId)
    .set('date', date);

    return this.http
      .get<Array<Trip>>(environment.apiUrl + '/miles/get', {params: params})
      .pipe(share());
  }
}
