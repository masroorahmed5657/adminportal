import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { AdminUser } from '../models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  constructor(private http: HttpMethodService) {

    // super('employees')
    // this.http.setEndpoint('employees')
  }

  /* ********************* */



  getAdminUserList(): Observable<AdminUser[]> {

    return this.http.get<AdminUser[]>('adminuser/findAllAdminUser');

  }


  /* ********************* */
  save(employees: AdminUser): Observable<AdminUser> {

    return this.http.post<AdminUser>('adminuser/save', employees)

  }
  /* ********************* */
  delete(userId: number): Observable<any> {

    return this.http.delete(`adminuser/delete/${userId}`);
  }

}
