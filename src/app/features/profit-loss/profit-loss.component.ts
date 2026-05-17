import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersCustomerWrapper, PurchaseOrder, Payment, Category, Expenses, OrderSearch, OrderResponse } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CheckoutService } from '../../shared/services/checkout-service.service';
import { ExpenseService } from '../../shared/services/expense-service.service';
import { OrderService } from '../../shared/services/order.service';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Header2Component } from "../header2/header2.component";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-profit-loss',
  imports: [FormsModule,CommonModule,DecimalPipe],
  templateUrl: './profit-loss.component.html',
  styleUrl: './profit-loss.component.scss'
})
export class ProfitLossComponent implements  OnInit{

  orderViewList:OrdersCustomerWrapper[]=[];
  orderList:OrdersCustomerWrapper[]=[];
  purchaseOrderList: PurchaseOrder[]=[];
  purchaseOrderListNew: PurchaseOrder[]=[];
  paymentFlag=false;
  paymentList: Payment[]=[];
  paymentListnew:Payment[]=[];
  startDate:any=null;
  endDate:any=null;
  errorsFlag=false;
  spinnerDataLoad = false;
  selectedDepartment: any;
  categoryList: Category[]=[];
  Status: string[]=['NEW', 'PRINTED', 'CLOSED', 'REJECTED'];
  selectedOrderType: 'ONLINE' | 'POS' = 'ONLINE';
  currentOrderStatus: string = 'NEW';
  fileName= 'ExcelSheet.xlsx';
  dataSource: any;


  totalSales: number = 0;
  totalPurchases: number = 0;
  totalExpense: number = 0;
  netIncome: number = 0;


  dateRangeSelected: boolean = false;
  expenseList:Expenses[]=[];
  expenseListNew:Expenses[]=[];



  constructor(private orderService:OrderService,
              private checkoutService: CheckoutService,
              private cache: CacheService,
              private router: Router,
              private poService: PurchaseOrderService,
              private expenseService:ExpenseService,)
  {}


  ngOnInit(): void {



  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  exportToExcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profit & Loss');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  exportToPdf(): void {
    let DATA: any = document.getElementById('excel-table');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Profit & Loss.pdf');
    });
  }

  /* ********************************************************************* */
getOrderdata(orderStatus: string, orderType:string){
  let orderSearch: OrderSearch = new OrderSearch();
  orderSearch.status = orderStatus;
  orderSearch.orderType=orderType;
  orderSearch.createdDateStart = this.startDate; //this.searchForm.get('dateFrom')?.value;
  orderSearch.createdDateEnd = this.endDate;    //this.searchForm.get('dateTo')?.value;
  if (this.orderList!=null) {this.orderList.length=0;}



  this.checkoutService.getPaymentList().subscribe((data: Payment[]) => {
    if (data !== undefined || data !==null) {
    this.paymentFlag=false;
    this.paymentList=data;

   if (this.paymentList!==null || this.paymentList!=undefined){
   for (let i=0; i<this.paymentList.length; i++){
    this.paymentListnew.push(this.paymentList[i]);


    }}
 }});



  // this.orderService.getOrders(orderSearch).subscribe((data: OrderResponse) => {
  //   if (data !== undefined){
  //     this.errorsFlag=false;
  //     this.orderList=data.orderCustomer;

  //       if (this.orderList!==null || this.orderList!=undefined){
  //         for (let i=0; i<this.orderList.length; i++){
  //           this.orderViewList.push(this.orderList[i])

  //           let completedPaymentOrders = this.orderList.filter(order => this.isPaymentCompleted(order.orders?.orderId));
  //           this.totalSales = completedPaymentOrders.reduce((sum, order) => sum + (order.orders?.grandTotal || 0), 0);
  //         }
  //             this.netIncome = Math.round(this.totalSales - (this.totalPurchases + this.totalExpense));
  //       }
  //   }});

  this.orderService.getOrders(orderSearch).subscribe((data: OrderResponse) => {
    if (data !== undefined){
      this.errorsFlag = false;
      this.orderList = data.orderCustomer;

      if (this.orderList!==null || this.orderList!=undefined){
        for (let i=0; i<this.orderList.length; i++){
          this.orderViewList.push(this.orderList[i])

          this.totalSales = this.orderList.reduce((sum, orders) => sum + (orders.orders?.grandTotal || 0), 0);
        }
      }this.netIncome = Math.round(this.totalSales - (this.totalPurchases + this.totalExpense));

    }
  });

    this.poService.getAll().subscribe((data: PurchaseOrder[]) => {
      this.purchaseOrderList=data;

      if (this.purchaseOrderList!==null || this.purchaseOrderList!=undefined){
        for (let i=0; i<this.purchaseOrderList.length; i++){
          this.purchaseOrderListNew.push(this.purchaseOrderList[i])
        }
        this.totalPurchases = this.purchaseOrderListNew.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
      }
    });


    this.expenseService.getExpenseList().subscribe((data: Expenses[]) => {
      this.expenseList = data;

      // Assuming you have startDate and endDate set elsewhere in your component
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      if (this.expenseList !== null && this.expenseList !== undefined) {
        // Clear existing entries in expenseListNew
        // this.expenseListNew = [];

        for (let i = 0; i < this.expenseList.length; i++) {
          const expenseDate = new Date(this.expenseList[i].transactionDate);

          // Filter expenses based on the date range
          if (expenseDate >= startDate && expenseDate <= endDate) {
            this.expenseListNew.push(this.expenseList[i]);
          }
        }

        // Calculate total expense for the filtered list
        this.totalExpense = this.expenseListNew.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        this.calculateTotals();
      }
    });






}

calculateTotals(): void {
  // Calculate total sales completed payment
  let completedPaymentOrders = this.orderList.filter(order => this.isPaymentCompleted(order.orders?.orderId));
  this.totalSales = completedPaymentOrders.reduce((sum, order) => sum + (order.orders?.grandTotal || 0), 0);

  // Get purchase data
  this.totalPurchases = this.purchaseOrderListNew.reduce((sum, purchase) => sum + (purchase.total || 0), 0);

  // Calculate total expense
  this.expenseService.getExpenseList().subscribe((data: Expenses[]) => {
    this.expenseList = data;
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    if (this.expenseList !== null && this.expenseList !== undefined) {
      for (let i = 0; i < this.expenseList.length; i++) {
        const expenseDate = new Date(this.expenseList[i].transactionDate)
        if (expenseDate >= startDate && expenseDate <= endDate) {
          this.expenseListNew.push(this.expenseList[i]);
        }
      }
      this.totalExpense = this.expenseListNew.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    }



    // Calculate net income
    this.netIncome = Math.round(this.totalSales - (this.totalPurchases + this.totalExpense));
  });
}


/* ********************************************************************* */
startDateChange(){
  this.cache.set('startDate', this.startDate);
}
endDateChange(){
  this.cache.set('endDate', this.endDate);
}
/* ********************************************************************* */
onSearch(){

  if (this.selectedOrderType === 'ONLINE') {
   this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);
 }
 else if (this.selectedOrderType === 'POS') {
   this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);
 }
}



getPaymentStatus(orderId: any):  { status: any} {
  const matchingPayment = this.paymentList.find(payment => payment.orderId === orderId);
  if (matchingPayment) {
    return { status: matchingPayment.paymentStatus };
  } else {
    return { status: 'NOT PAID'};
  }
}

// Add a method to check if payment is completed
isPaymentCompleted(orderId: any): boolean {
  return this.getPaymentStatus(orderId).status === 'Complete';
}

  calculateNetIncome(): number {
    return this.totalSales - (this.totalPurchases + this.totalExpense);
  }



}
