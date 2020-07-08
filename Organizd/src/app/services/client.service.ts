import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, share } from 'rxjs/operators';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  subClient( input: Client) {
    return this.http
      .post<boolean>(environment.apiUrl + '/client/submit', input,{headers: this.headers})
      .pipe(share());
  }

  getClients( userId: string){
    const params = new HttpParams()
    .set('userId', userId);

    return this.http
      .get<Array<Client>>(environment.apiUrl + '/client/get', {params: params})
      .pipe(share());
  }
}
