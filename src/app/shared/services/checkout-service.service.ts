import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors'
import { loadStripe } from '@stripe/stripe-js';
import { CheckOutCreditCardPayment, Payment, PaymentRequest } from '../models/model-classes.model';
import { Cart, Product, PriceSummary, Customer, OrderSaveResponse, Orders, OrdersItems, CustomerRequest, StripeCardResponse } from '../models/model-classes.model';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private myUrl = environment.apiUrl  ; //http://localhost:9080/PAG_WS/
  private stripeUrl = environment.stripe
  private errors: Errors = new Errors();

  stripePromise = loadStripe(environment.stripe);
  cartDataList: Product[]=[];

  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal:0
  };
  totalPrice: any;


  constructor(private http: HttpClient ) { }
  appLogService: AppLoggerService = new AppLoggerService() ;


/* ************************************************************* */
cardPayment(payment: CheckOutCreditCardPayment): Observable<any>{

  let myUrl = `${this.myUrl}` + `payment/charge`  ;

  return this.http.post<any>(myUrl, payment).pipe(

    catchError(this.errors.handleError<any>('cardPayment'))
  );

}


getPaymentList(): Observable<Payment[]>{

  // let myUrl = `${this.myUrl}` + `payment/findAllPayment`  ;

  return this.http.get<Payment[]>('payment/findAllPayment')

}

/* *********************************************************************************** */
makePayment(stripeToken:string, grandTotalPrice:any, paymentParam: Payment):Observable<StripeCardResponse>{

  let amount= grandTotalPrice ;

  let myUrl = `${this.myUrl}` + `payment/charge`  ;

  let paymentRequest: PaymentRequest = new PaymentRequest() ;
  paymentRequest.amount=amount;
  paymentRequest.token = JSON.stringify(stripeToken) ;    //stripeToken;     //
  paymentRequest.payment = paymentParam;
  paymentRequest.description = environment.appName;

  //let myUrl2='';
   return this.http.post<StripeCardResponse>(myUrl, paymentRequest).pipe(
     catchError(this.errors.handleError<StripeCardResponse>('PaymentRequest'))
   );


}



}
