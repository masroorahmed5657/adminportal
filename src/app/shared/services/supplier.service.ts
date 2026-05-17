import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ApiResponse, Supplier } from '../models/model-classes.model';
import { Errors } from '../errors/errors';
import { environment } from '../../../environments/environment';
import { BaseHttpService } from '../helper/base.http.service';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private myUrl = environment.apiUrl; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http: HttpMethodService, private http2: HttpClient) {

    // super('supplier')
    // this.http.setEndpoint('supplier')

  }


  saveSupplier(supplier: Supplier): Observable<Supplier> {

    return this.http.post<Supplier>('supplier/save', supplier)

  }

  /* ********************* */
  getSupplierList(): Observable<Supplier[]> {

    return this.http.get<Supplier[]>('supplier/findAll')
  }




  /**********************/
  /* ********************* */
  delete(supplierId: number): Observable<any> {

    return this.http.post<any>(`supplier/delete/${supplierId}`,{})

  }

  /* ********************* */
  importSuppliers(file: File): Observable<ApiResponse> {

    return this.http.upload<any>('files/importSuppliers', file);
    // let myUrl = `${this.myUrl}` + `files/importSuppliers`;

    // const formData: FormData = new FormData();

    // formData.append('file', file);
    // const req = new HttpRequest('POST', `${this.myUrl}files/importSuppliers`, formData, {
    //   reportProgress: true,
    //   responseType: 'json',
    // });

    // return this.http2.request(req).pipe(catchError(this.errors.handleError<any>('Supplier Upload')));


  }

  /* ********************* */
  importSuppliers2(): Observable<ApiResponse> {

    return this.http.get<ApiResponse>('files/importSuppliers')
  }


}
