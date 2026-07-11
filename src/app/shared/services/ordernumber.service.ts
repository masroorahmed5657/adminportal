import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders } from '../../shared/models/model-classes.model';
import { HttpMethodService } from '../../shared/helper/http-method.service';

@Injectable({ providedIn: 'root' })
export class OrderNumberService {

  constructor(private http: HttpMethodService) {}

  getAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>('orders/findAll');
  }

  searchOrders(search: any): Observable<Orders[]> {
    return this.http.post<Orders[]>('orders/search', search);
  }

  saveOrder(order: Orders): Observable<Orders> {
    return this.http.post<Orders>('orders/save', order);
  }

  updateOrder(order: Orders): Observable<Orders> {
    return this.http.put<Orders>('orders/update', order);
  }

  deleteOrder(id: any): Observable<any> {
    return this.http.delete(`orders/delete/${id}`);
  }

  getOrderByOrderNumber(orderNum: any): Observable<Orders> {
    return this.http.get<Orders>(`orders/findByOrderNum/${orderNum}`);
  }

  generateOrderNumber(): Observable<any> {
    return this.http.get<any>('orders/generateOrderNumber');
  }
}