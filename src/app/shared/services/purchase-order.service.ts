import { Injectable } from '@angular/core';
import { PoItems, POItemsView, POListResponse, PORequest, POResponse, POSearch, PurchaseOrder } from '../models/model-classes.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {


  private myUrl = environment.apiUrl; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http: HttpMethodService) { }





  // save(purchaseorder: PurchaseOrder): Observable<PurchaseOrder>{

  //   let myUrl = `${this.myUrl}` + `purchaseOrder/save`  ;

  //   return this.http.post<PurchaseOrder>(myUrl, purchaseorder).pipe(
  //       // tap( Errors ==> this.log('Save Supplier') ),
  //     catchError(this.errors.handleError<PurchaseOrder>('savePurchaseOrder'))
  //   );

  // }

  /* ************************************************************* */
  getMonthly(): Observable<POListResponse> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/findMonthly/`;

    return this.http.get<POListResponse>('purchaseOrder/findMonthly')

  }


  getAll(): Observable<PurchaseOrder[]> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/findAll/`;

    return this.http.get<PurchaseOrder[]>('purchaseOrder/findAll/')

  }
  /* ************************************************************* */

  getBySearch(poSearch: POSearch): Observable<POListResponse> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/findBySearch/`;

    return this.http.post<POListResponse>('purchaseOrder/findBySearch', poSearch)

  }

  /* ************************************************************* */
  save(poReqeust: PORequest): Observable<POResponse> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/save`;

    return this.http.post<POResponse>('purchaseOrder/save', poReqeust)

  }

  /* ***************************************************** */

  delete(poId: number): Observable<any> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/delete/` + poId;
    let myUrl =  `purchaseOrder/delete/` + poId ;
 
    return this.http.delete(myUrl);
    
    // .pipe(
      
    //   catchError(this.errors.handleError('deletePurchaseOrder'))
    // );

    //return this.http.delete<any>('purchaseOrder/delete', poId)

  }
  /* ***************************************************** */
  deletePoItem(poItemId: number): Observable<POResponse> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/items/delete/` + poItemId ;

    return this.http.get<POResponse>('purchaseOrder/items/delete/' + poItemId)

  }

  /* ***************************************************** */
  getPo(poId: number): Observable<PurchaseOrder> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/` + poId;

    return this.http.get<PurchaseOrder>('purchaseOrder/' + poId)

  }
  /* ***************************************************** */
  getPoItem(poId: number): Observable<POItemsView[]> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/items/` + poId;

    return this.http.get<POItemsView[]>('purchaseOrder/items/' + poId)

  }



}

