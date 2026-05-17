import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Address, AdminUser, AdminUserRoles, LoginRequest, UserLoginResponse } from '../models/model-classes.model';
import { Errors } from '../errors/errors';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
// environment

export class UseraddService {

  private myUrl = environment.apiUrl ; //http://localhost:8082/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http:HttpClient) { }


saveUser(user: AdminUser): Observable<AdminUser>{

  let myUrl = `${this.myUrl}` + `adminuser/save`  ;

  return this.http.post<AdminUser>(myUrl, user).pipe(

    catchError(this.errors.handleError<AdminUser>('saveUser'))
  );

}
/* ***************************************************************** */
saveUserRoles(userRoleList: AdminUserRoles[]): Observable<any>{

  let myUrl = `${this.myUrl}` + `adminuser/updateRoles`  ;

  return this.http.post<any>(myUrl, userRoleList).pipe(

    catchError(this.errors.handleError<any>('saveUser'))
  );

}

/* ************************************************************* */
getUserList(): Observable<AdminUser[]>{

  let myUrl = `${this.myUrl}` + `adminuser/findAllAdminUser/` ;

  return this.http.get<AdminUser[]>(myUrl).pipe(

    catchError(this.errors.handleError<AdminUser[]>('AdminList'))
  );
}
/* ************************************************************* */
deleteUser(userId: any): Observable<any>{

  let myUrl = `${this.myUrl}` + `adminuser/delete/` + userId  ;

  return this.http.delete<number>(myUrl, userId).pipe(

    catchError(this.errors.handleError<number>('saveUser'))
  );

}
/* **************************************************************** */
changePwd(loginRequest: LoginRequest): Observable<UserLoginResponse>{

  let myUrl = `${this.myUrl}` + `adminuser/updatePassword`  ;

  return this.http.post<UserLoginResponse>(myUrl, loginRequest).pipe(

    catchError(this.errors.handleError<UserLoginResponse>('saveUser'))
  );

}
/* ************************************************************* */
getUserRoles(userId: any): Observable<AdminUserRoles[]>{

  let myUrl = `${this.myUrl}` + `adminuser/findUserRoles/` + userId ;

  return this.http.get<AdminUserRoles[]>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<AdminUserRoles[]>('getProducts'))
  );

}


}
