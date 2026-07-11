import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../shared/models/model-classes.model';
import { HttpMethodService } from '../../shared/helper/http-method.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  constructor(private http: HttpMethodService) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>('payment/findAll');
  }

  searchPayments(search: any): Observable<Payment[]> {
    return this.http.post<Payment[]>('payment/search', search);
  }

  savePayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>('payment/save', payment);
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>('payment/update', payment);
  }

  deletePayment(id: any): Observable<any> {
    return this.http.delete(`payment/delete/${id}`);
  }

  getPaymentByOrderId(orderId: any): Observable<Payment> {
    return this.http.get<Payment>(`payment/findByOrderId/${orderId}`);
  }
}