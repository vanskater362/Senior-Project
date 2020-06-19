import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { User } from '../models/user';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          //.set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/auth/login`, { email, password },{headers: this.headers})
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateUser(input: any) {
    localStorage.setItem('currentUser', JSON.stringify(input));
    this.currentUserSubject.next(input);
  }

  register( input: Register) {
    return this.http
      .post<boolean>(environment.apiUrl + '/auth/registerUser', input,{headers: this.headers})
      .pipe(share());
  }

  changePassword( curPasssword: string, password: string, userId: number ) {
    return this.http
      .post<boolean>(environment.apiUrl + '/auth/changePassword', {curPasssword, password, userId})
      .pipe(share());
  }

  resetPassword(email: string) {
    return this.http
      .post<boolean>(environment.apiUrl + '/auth/resetPassword', {email})
      .pipe(share());
  }
}
