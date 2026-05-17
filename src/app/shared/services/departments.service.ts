import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Departments } from '../models/model-classes.model';
import { Errors } from '../errors/errors';
import { environment } from '../../../environments/environment';
import { HttpMethodService } from '../helper/http-method.service';
import { BaseHttpService } from '../helper/base.http.service';
import { HttpHelperService } from '../helper/base-header.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private myUrl = environment.apiUrl;

  constructor(private http: HttpMethodService, private httpClient: HttpClient) {

    // super('departments')
    // this.http.setEndpoint('departments')
  }
  /* ****************************************************************** */
  getDepartmentList(): Observable<Departments[]> {

    return this.http.get<Departments[]>('departments/findAll')
  }


  saveDep(departments: Departments): Observable<Departments> {

    return this.http.post<Departments>('departments/save', departments)

  }

  /* ********************* */
  getDepList(): Observable<Departments[]> {

    return this.http.get<Departments[]>('departments/findAll')
  }


  /* **************************************************************** */
  delete(deptId: number): Observable<any> {

    return this.http.post<any>(`departments/delete/${deptId}`, {})

  }
  /* **************************************************************** */
  upload(file: File, departmentId: any): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('departmentId', departmentId);

    const path = `${this.myUrl}` + `departments/upload`;

    const req = new HttpRequest('POST', path, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.httpClient.post(path, formData,
      {
        headers: HttpHelperService.getAuthHeadersForFile()
      });


    //return this.http2.request(req);
  }

  /* ************************************************************* */
  deleteImage(departmentId: number): Observable<any> {

    return this.http.delete(`departments/deleteImage/${departmentId}`)
  }


}
