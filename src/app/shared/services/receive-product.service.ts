import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { POItemsView, ProductView, PurchaseOrder, ReceiveProduct, ReceiveProductItems, ReceiveProductItemsView, ReceiveProductRequest, ReceiveProductResponse, ReceiveProductSearch } from '../models/model-classes.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { BaseHttpService } from '../helper/base.http.service';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiveProductService {

  constructor(private http: HttpMethodService) {


  }


  /* **************************************************** */
  getProductByUpc(upc: any): Observable<ProductView[]> {

    // let myUrl = `${this.myUrl}` + `products/findProductsByUpc/` + upc;;

    return this.http.get<ProductView[]>('receiveProduct/findProductsByUpc' + upc)
  }

  /* **************************************************** */
  getProductBySku(sku: any): Observable<ProductView[]> {

    return this.http.get<ProductView[]>('receiveProduct/findProductsBySku' + sku)
  }





  /* **************************************************** */
  getReceiveList(): Observable<ReceiveProduct[]> {

    return this.http.get<ReceiveProduct[]>('receiveProduct/findAll')
  }
  /* **************************************************** */
  saveReceiveList(receiveProduct: ReceiveProduct): Observable<ReceiveProduct> {

    return this.http.post<ReceiveProduct>('receiveProduct/save', receiveProduct)

  }

  /* ***************************************************** */
  delete(receiveProductId: number): Observable<any> {

    return this.http.post<any>('receiveProduct/delete/', receiveProductId)

  }



  /* ************************************************************* */

  getAll(): Observable<ReceiveProductResponse> {

    return this.http.get<ReceiveProductResponse>('receiveProduct/findAll')

  }
  /* ************************************************************* */

  getBySearch(search: ReceiveProductSearch): Observable<ReceiveProductResponse> {

    return this.http.post<ReceiveProductResponse>('receiveProduct/findBySearch/', search)

  }

  /* ************************************************************* */
  save(rcvProduct: ReceiveProduct, items: ReceiveProductItems[]): Observable<ReceiveProductResponse> {
    let rcvRequest: ReceiveProductRequest = new ReceiveProductRequest();
    rcvRequest.receiveProduct = rcvProduct;
    rcvRequest.rcvProductItems = items;
    

    return this.http.post<ReceiveProductResponse>('receiveProduct/save', rcvRequest)
  }



  receiveProductItems(id: any): Observable<ReceiveProduct[]> {

    return this.http.get<ReceiveProduct[]>('receiveProduct/findAll' + id)
  }

  getPOByPOId(poId:any){

    return this.http.get<PurchaseOrder>('purchaseOrder/' + poId);

  }


  getPOByPONumber(poNumber:any){

    return this.http.get<PurchaseOrder>('purchaseOrder/findByPoNumber/' + poNumber);

  }

  getPoItem(poId: number): Observable<POItemsView[]> {

    // let myUrl = `${this.myUrl}` + `purchaseOrder/items/` + poId;

    return this.http.get<POItemsView[]>('purchaseOrder/items/' + poId)

  }

  getRcvByPOId(poId:any){

    return this.http.get<ReceiveProduct>('receiveProduct/findByPoId/' + poId);

  }

  getRcvItem(receiveProductId: number): Observable<ReceiveProductItemsView[]> {

    return this.http.get<ReceiveProductItemsView[]>('receiveProduct/items/' + receiveProductId)

  }


  getRcvByRcvId(rcvId:any){

    return this.http.get<ReceiveProduct>('receiveProduct/' + rcvId);

  }


}
