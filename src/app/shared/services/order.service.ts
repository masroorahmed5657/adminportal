import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors'
import { OrderPaymentResponse, OrderResponse, Orders, OrderSaveResponse, OrderSearch, OrdersItems, OrdersWrapper, Payment, QurbaniResponse } from '../models/model-classes.model';
import { catchError, Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService {


  // private myUrl = environment.apiUrl ; //http://localhost:8082/FASHION_API/
  // errors: Errors = new Errors();


  constructor(private http: HttpMethodService) { }

  // getBackorderPaymentStatus(orderId: number): Observable<Payment[]> {
  //   const url = `${this.myUrl}/orders/${orderId}/payment-status`;
  //   return this.http.get<number>(url);
  // }


  getBackorderPaymentStatus(orderId: number): Observable<Payment[]> {

    // const url = `${this.myUrl}orders/${orderId}/payment-status`;

    return this.http.get<Payment[]>(`orders/${orderId}/payment-status`)

  }


  /* ************************************************************* */

  getOrders(orderSearch: OrderSearch): Observable<OrderResponse> {

    // let myUrl = `${this.myUrl}` + `orders/findOrdersWithItems/` ;

    return this.http.post<OrderResponse>('orders/findOrdersWithItems', orderSearch)
    //return this.http.post<OrderResponse>('orders/ordersDetails', orderSearch)

  }


  getOnlineOrders(orderSearch: OrderSearch): Observable<OrderResponse> {
    // let myUrl = `${this.myUrl}` + `orders/findOrdersWithItems/` ;

    return this.http.post<OrderResponse>('orders/findOrdersWithItems', orderSearch)
  }

  getPosOrders(orderSearch: OrderSearch): Observable<OrderResponse> {
    // let myUrl = `${this.myUrl}` + `orders/findOrdersWithItems/` ;

    return this.http.post<OrderResponse>('orders/findOrdersWithItems', orderSearch)
  }


  /* ************************************************************* */
  saveOrders(orders: OrderSaveResponse): Observable<OrderSaveResponse> {

    // let myUrl = `${this.myUrl}` + `orders/save/`  ;

    return this.http.post<OrderSaveResponse>('orders/save', orders)

  }
  /* ************************************************************* */
  updateOrders(orders: OrderSaveResponse): Observable<OrderSaveResponse> {

    // let myUrl = `${this.myUrl}` + `orders/updateOrders/`  ;

    return this.http.post<OrderSaveResponse>('orders/updateOrders', orders)

  }
  /* ************************************************************* */
  updateItemStatus(items: OrdersItems): Observable<any> {

    // let myUrl = `${this.myUrl}` + `orders/item/updateStatus/`  ;

    return this.http.post<OrdersItems>('orders/item/updateStatus', items)

  }
  /* ************************************************************* */

  getQurbaniTotals(): Observable<QurbaniResponse> {

    // let myUrl = `${this.myUrl}` + `orders/qurbani` ;

    return this.http.get<QurbaniResponse>('orders/qurbani')

  }

  /* ************************************************************* */

  closeOrders(currentStatus: any, targetStatus: any): Observable<any> {

    // let myUrl = `${this.myUrl}` + `orders/close/` + currentStatus + '/' + targetStatus;

    return this.http.get<any>(`orders/close/` + currentStatus + '/' + targetStatus)

  }
  /* ************************************************************* */

  resetOrderNum(startNumber: any): Observable<any> {

    // let myUrl = `${this.myUrl}` + `orders/resetOrderNumber/` + startNumber;

    return this.http.get<any>('orders/resetOrderNumber/' + startNumber)

  }

  /* ********************************************************************** */

  findPaymentsOrderByDate(orderSearch: OrderSearch): Observable<OrderPaymentResponse> {
    // let myUrl = `${this.myUrl}` + `payment/findPaymentsOrderByDate/`;

    return this.http.post<OrderPaymentResponse>('payment/findPaymentsOrderByDate', orderSearch)
  }



}
