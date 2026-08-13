import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OrderCustomerPayment, Payment, Category, PriceSummary, OrderSearch, OrderPaymentResponse } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CheckoutService } from '../../shared/services/checkout-service.service';
import { OrderService } from '../../shared/services/order.service';
import { faPlusSquare, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
//import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-orders-payment',
  imports: [FormsModule, FontAwesomeModule, CommonModule, NgxPaginationModule], //NgbCarouselModule],
  templateUrl: './orders-payment.component.html',
  styleUrl: './orders-payment.component.scss'
})
export class OrdersPaymentComponent implements OnInit {
  orderViewList: OrderCustomerPayment[] = [];
  orderList: OrderCustomerPayment[] = [];
  paymentFlag = false;
  paymentList: Payment[] = [];
  paymentListnew: Payment[] = [];
  startDate: any = null;
  endDate: any = null;
  errorsFlag = false;
  spinnerDataLoad = false;
  selectedDepartment: any;
  categoryList: Category[] = [];
  orderStatus: string[] = ['NEW', 'PRINTED', 'CLOSED', 'REJECTED'];
  selectedOrderType: 'ONLINE' | 'POS' = 'ONLINE';
  currentOrderStatus: string = 'NEW';
  p: number = 1;
  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal: 0
  }

  faDollar = faDollar;

  constructor(
    private orderService: OrderService,
    private checkoutService: CheckoutService,
    private cache: CacheService,
    private router: Router,
  ) { }
  /* ********************************************************************* */
  ngOnInit(): void {

  }
  /* ********************************************************************* */
  getOrderdata(orderStatus: string, orderType: string) {
    let orderSearch: OrderSearch = new OrderSearch();
    orderSearch.status = orderStatus;
    orderSearch.orderType = orderType;
    orderSearch.createdDateStart = this.startDate; //this.searchForm.get('dateFrom')?.value;
    orderSearch.createdDateEnd = this.endDate;    //this.searchForm.get('dateTo')?.value;
    //orderSearch.orderType = this.selectedOrderType;

    if (environment.currency === 'USD') {
      this.faDollar = faDollar;
    }
    else if (environment.currency === 'PKR') {
      this.faDollar = faRupeeSign;
    }


    //Reset list
    if (this.orderList !== null) this.orderList.length = 0;
    if (this.orderViewList !== null) this.orderViewList.length = 0;

    orderSearch.createdDateStart = this.startDate;
    orderSearch.createdDateEnd = this.endDate;
    orderSearch.orderType='POS';
    if (this.orderList != null) { this.orderList.length = 0; }
    this.orderService.findPaymentsOrderByDate(orderSearch).subscribe((data: OrderPaymentResponse) => {
      if (data !== undefined) {
        this.errorsFlag = false;
        this.orderList = data.orderList;

        if (this.orderList !== null || this.orderList != undefined) {
          for (let i = 0; i < this.orderList.length; i++) {
            this.orderViewList.push(this.orderList[i]);
          }
          //this.orderViewList.sort();
          this.orderViewList.reverse();
          this.spinnerDataLoad = false;
        }

        this.checkoutService.getPaymentList().subscribe((data: Payment[]) => {
          if (data !== undefined || data !== null) {
            this.paymentFlag = false;
            this.paymentList = data;

            if (this.paymentList !== null || this.paymentList != undefined) {
              for (let i = 0; i < this.paymentList.length; i++) {
                this.paymentListnew.push(this.paymentList[i]);


              }
            }
          }
        });
      }
    });

  }

  /* ********************************************************************* */
  startDateChange() {
    this.cache.set('startDate', this.startDate);
  }
  endDateChange() {
    this.cache.set('endDate', this.endDate);
  }
  /* ********************************************************************* */
  onSearch() {

    if (this.selectedOrderType === 'ONLINE') {
      this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);
    }
    else if (this.selectedOrderType === 'POS') {
      this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);
    }
  }
  /* ********************************************************************* */

  getPaymentStatus(orderId: any): string {
    const matchingPayment = this.paymentList.find(payment => payment.orderId === orderId);
    return matchingPayment ? matchingPayment.paymentStatus : 'NOT PAID';
  }

  // Add a method to check if payment is completed
  isPaymentCompleted(orderId: any): string {
    if (  this.getPaymentStatus(orderId) === 'COMPLETE') {
      return 'paid';
    }
    else {
      return 'notpaid';
    }

  }

}
