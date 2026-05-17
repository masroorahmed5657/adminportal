import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Errors } from '../../shared/errors/errors'
import { AdminUser, UserLoginResponse } from '../../shared/models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userSubject: BehaviorSubject<AdminUser | null>;
  public user: Observable<AdminUser | null>;
  private url = environment.apiUrl + 'login'; //http://localhost:9080/FASHION_API/login
  private errors: Errors = new Errors();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(loginId: any, loginPassword: any) {
    return this.http.post<AdminUser>(`${environment.apiUrl}/users/authenticate`, { loginId, loginPassword })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: AdminUser) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  registerUser(adminUser: AdminUser): Observable<AdminUser> {
    //http://localhost:9080/PAG_WS/register
    let myUrl = environment.apiUrl + `register`;


    return this.http.post<AdminUser>(myUrl, adminUser).pipe(
      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<AdminUser>('saveRegister'))
    );

  }

  signinUser(adminUser: AdminUser): Observable<UserLoginResponse> {

    let myUrl = `${this.url}` + `signin`;

    return this.http.post<UserLoginResponse>(myUrl, adminUser).pipe(

      //tap( error ==> this.log('Save orders') ),
      catchError(this.errors.handleError<UserLoginResponse>('signinUser'))
    );

  }

  // Provide username and password for authentication, and once authentication is successful, 
  //store JWT token in local if remembered else store in session
  // authenticate(username: string, password: any) {

  // let endpoint = environment.apiUrl + `authenticate`;

  //   return this.http
  //     .post<any>(endpoint, { username, password })
  //     .pipe(
  //       catchError(this.errors.handleError<UserLoginResponse>('signinUser Error')),
  //       map(userData => {
  //         sessionStorage.setItem("username", username);
  //         let tokenStr = "Bearer " + userData.token;
  //         sessionStorage.setItem("token", tokenStr);
  //         return userData;
  //       })
  //     );
  //   }

  authenticate(username: string, password: any) {
    let endpoint = environment.apiUrl + `authenticate`;

    const headers = new HttpHeaders()
    .set('X-DB', username)
    .set('Content-Type', 'application/json');


    return this.http
      .post<any>(endpoint, { username, password }, { headers } )
      .pipe(
        catchError(this.errors.handleError<UserLoginResponse>('signinUser Error')),
        map(userData => {
          // bas data return karo, storage ka kaam yahan nahi hoga
          let tokenStr = "Bearer " + userData.token;
          return { ...userData, token: tokenStr };
        })
      );
  }




}
