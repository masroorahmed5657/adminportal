import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderNumber, Orders } from '../../shared/models/model-classes.model';
import { HttpMethodService } from '../../shared/helper/http-method.service';

@Injectable({ providedIn: 'root' })
export class OrderNumberService {

  constructor(private http: HttpMethodService) {}

  getAllOrders(): Observable<OrderNumber[]> {
    return this.http.get<OrderNumber[]>('orderNumber/findAll');
  }

  searchOrders(search: any): Observable<OrderNumber[]> {
    return this.http.post<OrderNumber[]>('orderNumber/search', search);
  }

  saveOrder(order: OrderNumber): Observable<OrderNumber> {
    return this.http.post<OrderNumber>('orderNumber/save', order);
  }

  updateOrder(order: OrderNumber): Observable<OrderNumber> {
    return this.http.put<OrderNumber>('orderNumber/update', order);
  }

  deleteOrder(id: any): Observable<any> {
    return this.http.delete(`orderNumber/delete/${id}`);
  }

  getOrderByOrderNumber(orderNum: any): Observable<OrderNumber> {
    return this.http.get<OrderNumber>(`orderNumber/findByOrderNum/${orderNum}`);
  }

  generateOrderNumber(): Observable<any> {
    return this.http.get<any>('orderNumber/generateOrderNumber');
  }
}