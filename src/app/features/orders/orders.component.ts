import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  OrderItemProductWrapper, OrdersItems, Departments, Category,
  CategoryQty, Qurbani, Country, StateProvince, ProductView, OrderSearch,
  OrdersItemsView, Orders, Customer,
  OrderMenuResponse, OrdersMenuView
} from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CategoryService } from '../../shared/services/category.service';
import { DepartmentsService } from '../../shared/services/departments.service';
import { OrderService } from '../../shared/services/order.service';
import { ProductsService } from '../../shared/services/products.service';
import { faSearch, faRupeeSign, faDollar, faCircle, faBook, faHome, faDeleteLeft, faRemove, faUndo, faSave, faCoffee, faSignIn } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from "sweetalert2";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from '../pipes/search-pipe.pipe';
import { NgxPrintModule } from 'ngx-print';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [FormsModule, CommonModule, FontAwesomeModule, NgxPaginationModule, SearchPipe, NgxPrintModule],
  providers: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})

export class OrdersComponent implements OnInit {
  @Input("data") data: any;
  @Input() name: any;
  terms = "";
  p: number = 1;
  currentPageNumber: number = 1;
  faDollar = faDollar;
  faSearch = faSearch;
  faBook = faBook;


  currentCurrency = 'USD';

  orderViewList: OrdersMenuView[] = [];
  //orderViewList: OrdersCustomerWrapper[] = [];
  //orderItemWrapperList: OrderItemProductWrapper[] = [];
  //orderItemWrapperViewList: OrderItemProductWrapper[] = [];
  //orderFinalViewList: OrdersCustItemProdCatWrapper[] = [];

  orderStatus: string[] = ['NEW', 'PRINTED', 'CLOSED', 'REJECTED'];
  ordersItemsList: OrdersItems[] = [];
  deptList: Departments[] = [];
  categoryList: Category[] = [];
  qurbaniResponse: CategoryQty[] = [];
  currentUser: any;

  selectedOrderType= 'PICKUP' ;
  orders: any[] = [];

  qurbaniModel: Qurbani = new Qurbani();

  searchForm: FormGroup = new FormGroup({
    orderStatus: new FormControl('NEW'),
    dateFrom: new FormControl(),
    dateTo: new FormControl()
  });

  startDate: any = null;
  endDate: any = null;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });


  showPrintThermalDiv = false;
  showPrintDiv = true;
  errorsFlag = false;
  orderDetail: any;
  itemsPerPage = 12;

  selectedDepartment: any;
  searchType: any;

  today: Date = new Date();

  countryList: Country[] = [];
  provinceList: StateProvince[] = [];
  productList: ProductView[] = [];

  //cache: any;

  total: any = 0;
  quantity = 0;

  // fromDate:any=this.datepipe.transform(new Date(),"yyyy-MM-dd");
  fromDate: any;
  // toDate:any=this.datepipe.transform(new Date(),"yyyy-MM-dd");
  toDate: any;
  currentOrderStatus: string = 'NEW';
  projectName = environment.appName;
  spinnerDataLoad = false;
  isListView: boolean = false;

  now = new Date();
  timerSub!: Subscription;

  WARNING_MINUTES = 15;   // turn red
  CRITICAL_MINUTES = 20; // optional escalation

  constructor(private orderService: OrderService,
    private router: Router,
    private datepipe: DatePipe,
    private productService: ProductsService,
    private cache: CacheService,
    private deptService: DepartmentsService,
    private categoryService: CategoryService

  ) { }

  /* ********************************************************************* */
  ngOnInit(): void {


    this.fromDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");


    //this.loadOrders();
    this.spinnerDataLoad = true;

    this.timerSub = interval(1000).subscribe(() => {
      this.now = new Date();
    });

    setTimeout(function () {

      let t1 = parent.window.localStorage['reload'];
      window.location.reload();

    }, 120000);


    //delay(30000).arguments( window.location.reload());
    this.searchType = 1;
    let t1 = this.searchType;


    //Default Category and department. First check if any
    this.startDate = this.cache.get('startDate');
    this.endDate = this.cache.get('endDate');

    let user = sessionStorage.getItem('currentUser');

    if (typeof (user) !== 'undefined' && user !== null && user !== '') {
      this.currentUser = JSON.parse(user);
    }

    this.deptService.getDepList().subscribe((data: Departments[]) => {
      //this.deptList=data ;
      if (data != null || data != undefined) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].activeFlag) {
            this.deptList.push(data[i]);
          }
        }
      }

      //Get Category List
      this.categoryService.getCategoryList().subscribe((data: Category[]) => {
        this.categoryList = data;
        this.categoryList.sort();

        this.spinnerDataLoad = false;
      });



    });


    //RESET
    //this.orderList.length = 0;
    this.orderViewList.length = 0;
    //this.orderItemWrapperList.length = 0;
    //this.orderItemWrapperViewList.length = 0;



    let dept = this.cache.get('selectedDepartment');
    if (dept === null || dept === 'undefined') {
      this.selectedDepartment = 'ALL';
    }
    else {
      this.selectedDepartment = dept;
      this.cache.set('selectedDepartment', this.selectedDepartment);
    }

    this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);//, this.fromDate, this.toDate);//NEW


  }//ngOnInit()
  /* ********************************************************************************* */

  loadOrders() {
    this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);
  }


  getOrderdata(orderStatus: string, orderType: string) {
    this.spinnerDataLoad = true; // 👈 loader start

    let orderSearch: OrderSearch = new OrderSearch();
    orderSearch.status = orderStatus;
    orderSearch.orderType = orderType;
    orderSearch.createdDateStart = this.startDate;
    orderSearch.createdDateEnd = this.endDate;
    orderSearch.categoryId = null;
    orderSearch.custId = null;
    orderSearch.productId = null;

    let oldOrderCount = 1;
    let newOrderCount = 2;


    this.orderService.getTodaysOrders(orderSearch).subscribe({
      next: (data: OrderMenuResponse) => 
        {
        this.errorsFlag = false;
        this.orderViewList = data.orderMenuList;
        if (this.orderViewList!==null){

        
        //this.orderItemWrapperList = data?.orderItems ?? [];

        if (this.orderViewList.length) {
          this.orderViewList = [...this.orderViewList].reverse();
          //this.orderItemWrapperViewList = [...this.orderItemWrapperList].sort();


          ////////////////////////////////////////////////////////////////////
          //Code added on Jan 20, 2026, AHMEDM
          /*export class OrdersView{
            agentName: any;
            customerName: any;
            orderNumber: any;
            orderId:any;
            tableId:any;
            time:any;
            createdDate:any;
            pickupDinein:any;
            menuList:MenuOrder[]=[];
          }*/





          if (oldOrderCount < newOrderCount) {
            this.playAudio();
          }

        }

        this.spinnerDataLoad = false; // 👈 loader stop
      }
      else{
        this.orderViewList = [];
        this.spinnerDataLoad = false; // 👈 loader stop
      }
      },
      error: (err) => {
        console.error(err);
        this.spinnerDataLoad = false; // 👈 loader stop on error
      }
    
    });
  }


  playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/audio/play.mp3"
    audio.load();
    audio.play();
  }

  /* ********************************************************************* */

  orderItemDecorator(item: any, product: any): OrdersItemsView {
    let orderItems = new OrdersItemsView();
    orderItems.discount = item.discount;
    orderItems.itemStatus = item.itemStatus;
    orderItems.liter = item.liter;
    orderItems.measuringUnit = item.measuringUnit;
    orderItems.orderId = item.orderId;
    orderItems.orderItemId = item.orderItemId;
    orderItems.productId = item.productId;
    orderItems.quantity = item.quantity;
    orderItems.unitPrice = item.unitPrice;
    orderItems.weight = item.weight;
    orderItems.productName = product.productName;
    orderItems.categoryName = this.getCategoryName(product.categoryId);
    orderItems.attributes = item.attributes;
    orderItems.notes = item.notes;

    if (this.selectedDepartment === 'ALL') {
      orderItems.showItem = true;
    }
    else if (this.selectedDepartment === orderItems.categoryName) {
      orderItems.showItem = true;
    }
    else {
      orderItems.showItem = false;
    }

    return orderItems;
  }
  /* ******************************************************************** */

  getCategoryName(categoryId: any): any {
    let category;
    for (let i = 0; i < this.categoryList.length; i++) {
      if (categoryId === this.categoryList[i].categoryId) {
        if (this.categoryList[i].category != null || this.categoryList[i].category != undefined) {
          category = this.categoryList[i].category;
        }

        break;
      }
    }

    return category;
  }
  /* ********************************************************************* */
  getProductName(productId: any, product: any) {

  }
  /* ********************************************************************* */
  // getOrderItems(orderId: any): OrdersItemsView[] {
  //   let ordersItemsViewList: OrdersItemsView[] = [];

  //   //Make new Item List only for this given orderId
  //   for (let i = 0; i < this.orderItemWrapperViewList.length; i++) {
  //     if (orderId === this.orderItemWrapperViewList[i].ordersItems?.orderId) {
  //       if (this.selectedDepartment === 'ALL') {
  //         let orderItems = new OrdersItemsView();
  //         orderItems = this.orderItemDecorator(this.orderItemWrapperViewList[i].ordersItems, this.orderItemWrapperViewList[i].products);
  //         orderItems.categoryName = this.orderItemWrapperViewList[i].category?.category;
  //         ordersItemsViewList.push(orderItems);

  //       }//ALL
  //       else {
  //         if (this.selectedDepartment === this.orderItemWrapperViewList[i].category?.category) {
  //           let orderItems = new OrdersItemsView();
  //           orderItems = this.orderItemDecorator(this.orderItemWrapperViewList[i].ordersItems, this.orderItemWrapperViewList[i].products);
  //           orderItems.categoryName = this.orderItemWrapperViewList[i].category?.category;
  //           ordersItemsViewList.push(orderItems);

  //         }

  //       }

  //     }
  //   }
  //   //console.log(ordersItemsViewList)
  //   return ordersItemsViewList;

  // }

  /* ********************************************************************* */
  statusChange(status: any) {

    //alert(status);

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
  onCancel() {
    this.searchForm.reset();
  }


  // Search Filter
  /* ********************************************************************* */
  Search() {
    if (this.orderDetail == "") {
      this.ngOnInit();
    }
    else {
      /*
      this.orderList = this.orderList.filter(res =>{
        return res.orderDetail.toLocaleLowerCase().match(this.orderDetail.toLocaleLowerCase());
      })
      */
    }
  }

  //sort options

  key: string = 'orderType';
  reverse: boolean = false;
  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  /* ********************************************************************* */
  productDetail(order: any, orderItemProductList: OrderItemProductWrapper[]) {
    // alert("data is find"+order);
    let myOrder: Orders = order.orders;
    let myCustomer: Customer = order.customer;

    let items: OrdersItemsView[] = [];

    for (let i = 0; i < orderItemProductList.length; i++) {

      if (orderItemProductList[i].ordersItems?.orderId === myOrder.orderId) {

        //let category: Category = orderItemProductList[i].category;
        //let product: Product = orderItemProductList[i].products;
        //let orderItem: OrdersItems[] = orderItemProductList[i].ordersItems;

        let ordersItemsView: OrdersItemsView = this.orderItemDecorator(orderItemProductList[i].ordersItems, orderItemProductList[i].products);

        items.push(ordersItemsView);
      }

    }

    this.cache.setList('orders', myOrder);
    this.cache.setList('ordersItem', items);
    this.cache.setList('customer', myCustomer);
    this.cache.set('selectedDepartment', this.selectedDepartment);
    this.router.navigate(['/layout/orderdetail']);

  }
  /* ******************************************************************************** */

  categoryChange() {

    let category = this.selectedDepartment;
    if (this.selectedDepartment !== 'ALL') {
      this.cache.set('selectedDepartment', this.selectedDepartment);

      //this.getOrderdata(this.orderStatus[this.searchType], this.selectedOrderType);//, this.fromDate, this.toDate);//NEW
      //this.getOrderdata(this.orderStatus[1]);//, this.fromDate, this.toDate);//PRINTED
      // window.location.reload();
    }
    else {
      this.cache.set('selectedDepartment', this.selectedDepartment);
    }

  }

  /* ********************************************************************************* */

  onUpdateStatus(order: any, itemId: any, status: any) {

    let item: OrdersItems = new OrdersItems();
    item.itemStatus = status;
    item.orderId = order.orders.orderId;
    item.orderItemId = itemId;



    this.orderService.updateItemStatus(item).subscribe((data: any) => {
      let returnData = data;
      if (returnData === 1) {
        window.location.reload();
      }

    });
  }
  /* ********************************************************************************* */
  checkDisable(status: any) {
    let retCode = false;
    if (status === 'CLOSED' || status === 'CANCEL') {
      retCode = true;
    }
    else {
      retCode = false;
    }
    return retCode;
  }

  /* ********************************************************************************* */

  // autoPrint(orderList: any) {

  //   let bFound = false; //used for any item for selected department

  //   for (let i = 0; i < orderList.length; i++) {
  //     bFound = false;
  //     let order = orderList[i];
  //     if (order.orders?.orderStatus === 'NEW') {

  //       let itemsForDept: OrdersItemsView[] = [];
  //       let items: OrdersItemsView[] = this.getOrderItems(order.orders?.orderId);

  //       if (items.length > 0) {
  //         for (let j = 0; j < items.length; j++) {
  //           let item = items[j];
  //           if (item.itemStatus === 'NEW' && item.categoryName === this.selectedDepartment) {
  //             this.onUpdateStatus(order, item.orderItemId, 'PRINTED');
  //             bFound = true;

  //             itemsForDept.push(item);
  //           }
  //           else if (item.itemStatus === 'NEW' && this.selectedDepartment === 'ALL') {
  //             //this.onUpdateStatus(order, item.orderItemId, 'PRINTED');
  //             //bFound=true;
  //             //itemsForDept.push(item);
  //             //NO PRINT IN ALL
  //           }
  //         }
  //         if (bFound) {
  //           let kk = 0;
  //           this.printThermalAuto(order, order.customer, itemsForDept);
  //           //this.print(order, itemsForDept);
  //         }

  //       }
  //     }
  //   }

  // }

  /* *********************************************************************************** */
  formatPhoneNumber(phoneNumberString: string) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }
  /* *********************************************************************************** */
  formatTime(datetimeStr: string) {
    let ret = '';
    //datetimeStr = 2023-05-29 16:23

    if (datetimeStr === null || datetimeStr === undefined) {
      return '';
    }

    let dtArray = datetimeStr.split(' ');

    let dateOnly = dtArray[0]; //2023-05-29
    let timeStr = dtArray[1]; //16:23
    let s1 = timeStr.substring(0, 2);//Hrs
    let s2 = timeStr.substring(3);//Minute
    let s1Number = Number(s1);
    let AMPM = 'AM';

    if (s1Number > 12) {
      AMPM = 'PM';
      s1Number = s1Number - 12;
    }
    else {
      AMPM = 'AM';
    }
    ret = s1 + ':' + s1Number;

    ret = dateOnly + ' ' + s1Number + ':' + s2 + ' ' + AMPM;
    return ret;

  }
  /* ******************************************* */
  getTotalPrice(totalPrice: any) {

    return Number(totalPrice).toFixed(2);

  }
  /* ******************************************* */
  onSearchType(val: any) {
    this.searchType = val;
    this.currentOrderStatus = this.orderStatus[val - 1];

    //refresh the list
    // this.orderViewList.length=0;
    // this.getOrderdata(this.orderStatus[val-1], this.selectedOrderType);//, this.fromDate, this.toDate);//NEW

  }
  /* ******************************************************** */
  getCss(): string {

    //font-family: 'monospace sans-serif';

    let myCss = `
    {
      font-size: 6px;
      font-family: 'calibri';
  }

  @media print {
      .hidden-print,
      .hidden-print * {
          display: none !important;
      }
      @page {
        margin-top: 0;
        margin-bottom: 0;
      }
  }`;


    return myCss;
  }


  /* *********************************************************************************** */
  print(order: any, items: any): void {

    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {

      popupWin.document.open();

      let orderAddress = order.customer?.address + ',' + order.customer?.city + ','
        + order.customer?.stateProvince + ',' + order.customer?.postalCode;

      let myCss = this.getCss();


      let myHead = `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <style>` + myCss +
        `</style>
    <title>` + this.projectName + `</title>
    </head>    `;


      let myHtml = ` <html> ` + myHead;

      let myBodyOrder = `<body onload="window.print();window.close();">

    <div class="ticket">
      <p style="text-center:align-content: center;font-size:6px;">
          <b>` + this.projectName + `</b>
        </p>
        <p style="text-align: left;align-content: left; font-size: x-large;"">
        <b>` + this.selectedDepartment + `</b><br>

        <br>` + order.customer?.firstName + `&nbsp; ` + order.customer?.lastName +
        `<br> ` + order.customer?.phone1 +
        `<br> Date:` + order.createDate +

        `<br>_______________________________________` +
        `<p style="font-size: x-large;"> Order#: <b>` + order.orderNum + ` </p></b>` +
        `</p>
      <p style="text-align: left;align-content: center; font-size: x-large;"">
      <b> PICKUP:  ` + order.orders?.pickupTime + `</b><br>
      </p>
      <table>

        </thead>
        <tbody>`;

      let myItems = ``;
      let total = 0;
      for (let i = 0; i < items.length; i++) {

        total = total + items[i].unitPrice;
        myItems = myItems +
          ` <tr style="text-align: left; font-size: x-large;font-family: 'calibri';">
                  <td >
                    <b>`
          + items[i].productName + ' -- ' + (this.selectedDepartment === 'MEAT' ? items[i].weight + ' lb ' : items[i].quantity)
          + `<br> ` + items[i].attributes + ` <br> ` +
          (items[i].notes === null ? '' : items[i].notes) +
          `</b><br>_______________________________________
                  </td>

                 </tr>`
      }


      let myBottonHtml = `

        <tr>
          <td colspan="6">Thanks for your purchase!</td>
        </tr>
        </tbody>
        </table>
    </div>

</body>
  </html>`
        ;

      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;;

      popupWin.document.write(myFinalHtml);

      popupWin.document.close();

    }//end if


  }//print()

  /* ************************************************************************************** */
  //Calling from Manual Print Button
  printThermal(order: any, customer: any, orderItemProductList: any): void {


    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    ////////////////////////////////////////////////////////////
    let myOrder: Orders = order.orders;
    let myCustomer: Customer = order.customer;
    let items: OrdersItemsView[] = [];

    for (let i = 0; i < orderItemProductList.length; i++) {

      if (orderItemProductList[i].ordersItems?.orderId === myOrder.orderId) {

        //let category: Category = orderItemProductList[i].category;
        //let product: Product = orderItemProductList[i].products;
        //let orderItem: OrdersItems[] = orderItemProductList[i].ordersItems;

        let ordersItemsView: OrdersItemsView = this.orderItemDecorator(orderItemProductList[i].ordersItems, orderItemProductList[i].products);

        items.push(ordersItemsView);
      }

    }//for loop

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {

      popupWin.document.open();

      let orderAddress = customer?.address + ',' + customer?.city + ','
        + customer?.stateProvince + ',' + customer?.postalCode;

      let myCss = this.getCss();


      let myHead = `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>` + myCss +
        `</style>

    <title>` + this.projectName + `</title>
    </head>    `;

      //<b> PICKUP:  ` +  order.orders?.pickupTime    + `</b><br>
      let myHtml = ` <html> ` + myHead;

      let phoneNumber = this.formatPhoneNumber(customer?.phone1);
      let formatDate = this.formatTime(myOrder.createDate);
      let today: Date = new Date();

      //let myBodyOrder = `<body >
      let myBodyOrder = `<body onload="window.print();window.close();">


    <div style=" width: 100%;font-weight: bold;">
        <p >
          <b>` + this.projectName + `</b>
        </p>
        <p style="text-align: left;align-content: left; font-size: x-large;"">
            <b>` + this.selectedDepartment + `</b><br>

            <br>` + customer?.firstName + `&nbsp; ` + customer?.lastName +
        `<br> ` + (phoneNumber === null ? '' : phoneNumber) +
        `<br> Date:` + formatDate +

        `<br>` +
        `<p style="font-size: x-large;"> Order#: <b>` + myOrder.orderNum + ` </p></b>` +
        `</p>
        <p style="text-align: left;align-content: center; font-size: x-large;">

        </p>

        <table style="border-top: 1px solid black;border-bottom: 1px solid black; border-collapse: collapse; width: 100%;">

            <tbody>`;


      let myItems = ``;
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        let currentItem = items[i];
        total = total + currentItem.unitPrice;

        let abbreviatedName = '';
        if (currentItem.categoryName === 'MEAT') {
          let prod = currentItem.productName.split(' ');
          let firstWord = [];

          for (let i = 0; i < prod.length; i++) {
            if (i === 0) {
              abbreviatedName = abbreviatedName + Array.from(prod[i])[0] + '|';
            }
            else {
              abbreviatedName = abbreviatedName + prod[i] + ' ';
            }

          }//for loop
          abbreviatedName = abbreviatedName + ' ' + currentItem.weight + ' lb ';
        }//if MEAT
        else {

          abbreviatedName = currentItem.productName + ' Qty= ' + currentItem.quantity;
        }

        myItems = myItems
          + ` <tr style="text-align: left; font-size: x-large;font-family: 'calibri';">
                          <td style='word-wrap: break-word;'>
                            <b>`
          + abbreviatedName +
          `</b>
                          </td>

                        </tr>`

      }
      let myTotal = Number(total).toFixed(2);

      let myBottonHtml =
        `
        </tbody>
        </table>
        Thanks for your purchase!
    </div>
  </body>
  </html>`
        ;

      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;

      popupWin.document.write(myFinalHtml);

      // popupWin.document.close();

    }//end if


  }//print()






  /* *********************************************************************************** */
  printThermalAuto(order: any, customer: any, items: any): void {

    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {

      popupWin.document.open();

      let orderAddress = customer?.address + ',' + customer?.city + ','
        + customer?.stateProvince + ',' + customer?.postalCode;

      let myCss = this.getCss();


      let myHead = `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>` + myCss +
        `</style>
    <title>` + this.projectName + `</title>
    </head>    `;

      // <p style="text-align: left;align-content: center; font-size: x-large;">
      //<b> PICKUP:  ` +  order.orders?.pickupTime    + `</b><br>
      //</p>
      let myHtml = ` <html> ` + myHead;

      let phoneNumber = this.formatPhoneNumber(customer?.phone1);
      let formatDate = this.formatTime(order.orders?.createDate);

      //let myBodyOrder = `<body >
      let myBodyOrder = `<body onload="window.print();window.close();">

    <div style=" width: 100%;font-weight: bold;">
        <p >
          <b>` + this.projectName + `</b>
        </p>
        <p style="text-align: left;align-content: left; font-size: x-large;"">
            <b>` + this.selectedDepartment + `</b><br>

            <br>` + customer?.firstName + `&nbsp; ` + customer?.lastName +
        `<br> ` + (phoneNumber === null ? '' : phoneNumber) +
        `<br> Date:` + formatDate +

        `<br>_______________________________________` +
        `<p style="font-size: x-large;"> Order#: <b>` + order.orders?.orderNum + ` </p></b>` +
        `</p>
        <p style="text-align: left;align-content: center; font-size: x-large;">

        </p>

        <table style="border-top: 1px solid black;border-bottom: 1px solid black; border-collapse: collapse; width: 100%;">

            <tbody>`;

      let myItems = ``;
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        let currentItem = items[i];
        total = total + currentItem.unitPrice;

        let abbreviatedName = '';
        if (currentItem.categoryName === 'MEAT') {
          let prod = currentItem.productName.split(' ');
          let firstWord = [];

          for (let i = 0; i < prod.length; i++) {
            if (i === 0) {
              abbreviatedName = abbreviatedName + Array.from(prod[i])[0] + '|';
            }
            else {
              abbreviatedName = abbreviatedName + prod[i] + ' ';
            }

          }//for loop
          abbreviatedName = abbreviatedName + ' ' + currentItem.weight + ' lb ';
        }//if MEAT
        else {

          abbreviatedName = currentItem.productName + ' -- ' + currentItem.quantity;
        }

        myItems = myItems
          + ` <tr style="text-align: left; font-size: x-large;font-family: 'calibri';">
                          <td style='word-wrap: break-word;'>
                            <b>`
          + abbreviatedName

          + `<br>  ` + (currentItem.attributes === null ? '' : currentItem.attributes) + `<br>  `
          + (currentItem.notes === null ? '' : currentItem.notes) +
          `</b>
                            _______________________________________
                          </td>

                        </tr>`

      }
      let myTotal = Number(total).toFixed(2);

      let myBottonHtml =
        `
        </tbody>
        </table>
        Thanks for your purchase!
    </div>
  </body>
  </html>`
        ;

      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;

      popupWin.document.write(myFinalHtml);
      popupWin.document.close();


    }//end if


  }//print()

  /* ******************************************************* */
  closeAllPrintedOrders() {

    Swal.fire({
      title: 'Are you sure to Close All Printed Orders  ?',
      text: 'You can not recuperate this Order!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((response: any) => {

      if (response.value) {
        this.orderService.closeOrders('PRINTED', 'CLOSED').subscribe((data: any) => {
          let returnData = data;
          if (returnData === 1) {
            window.location.reload();
          }

        });

      }
    });
  }
  //closeSingleOrders
  /* ******************************************************* */
  closeSingleOrders(orderId: any) {

    this.orderService.closeSingleOrders(orderId).subscribe((data: any) => {
      let returnData = data;
      if (returnData === 1) {
        window.location.reload();
      }

    });

  }



  /* ****************************************************** */
  resetOrderNumber() {

    let orderNumber = 0;
    Swal.fire({
      title: "Reset Order Number",
      text: "Start Number:",
      input: 'text',
      showCancelButton: true

    }).then((result) => {
      if (result.value) {
        console.log("Result: " + result.value);
        this.orderService.resetOrderNum(result.value).subscribe((data: number) => {
          orderNumber = data;

        });;
      }
    });


  }
  // openPDF(orders:any, DATA: any): void {
  //   //let DATA: any = document.getElementById('excel-table');
  //     html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 208;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('p', 'mm', 'a4');
  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     PDF.save('Order' ? orders.orderNum : orders.orderId );
  //   });
  // }

  openPDF(orders: any, DATA: any): void {
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      // ✅ File name check
      PDF.save(orders.orderNum || orders.orderId);
    });
  }



  /* **************************************************** */
  exportPDF() {

    let myHtml = '';
    for (let i = 0; i < this.orderViewList.length; i++) {
      myHtml = this.orderDetailHtml(this.orderViewList[i]);
      this.openPDF(this.orderViewList[i], myHtml);



    }

  }

  /* ******************************************************* */
  startDateChange() {
    this.cache.set('startDate', this.startDate);
  }
  endDateChange() {
    this.cache.set('endDate', this.endDate);
  }


  /* **************************************************************** */
  orderDetailHtml(orders: any) {
    let html = `<div class="wrapper" id="excel-table">
  <div class="invoice_wrapper"
    style="border:2px solid rgba(69, 218, 255, 0.658) !important; box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;">
    <div class="header">
      <div class="title_wrap" style="margin-left: 20px; font-family: sans-serif;">
        <h1 class="title bold" style="font-size: 20px;text-align: center;font-family: sans-serif;
          letter-spacing: 2px; font-size: xx-large;"><strong>EZPZ FASHION</strong></h1>
          <label>Order:` + orders.orderNum + `</label>
      </div>
	</div>
  </div>
</div>
`;


    return html;


  }

  /* *********************************************************** */
  nameChanged(event: any) {
    //console.log("modelchanged " + event);
    this.quantity = event

    return event;

  }

  getCountryName(countryId: any): any {
    let countryName: any = '';
    countryId = Number(countryId);
    for (let i = 0; i < this.countryList.length; i++) {
      if (countryId === this.countryList[i].countryId) {
        countryName = this.countryList[i].name;
        break;
      }
    }
    return countryName;
  }

  getStateName(stateId: any): any {
    let stateName: any = '';
    stateId = Number(stateId);
    for (let i = 0; i < this.provinceList.length; i++) {
      if (stateId === this.provinceList[i].stateId) {
        stateName = this.provinceList[i].stateCode;
        break;
      }
    }
    return stateName;
  }
  getDate(dt: string | Date) {
    return new Date(dt);
  }

   getElapsedTime(createdDate: string | Date ): string {

    //const normalizedDate = this.parseCustomDate(createdDate);
    const start = new Date(createdDate).getTime();
    const curTime = this.now.getTime();
    const diff = Math.floor((this.now.getTime() - start) / 1000);

    const mins = Math.floor(diff / 60);
    const secs = diff % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getTimerClass(createdDate: string | Date) {
    //const normalizedDate = this.parseCustomDate(createdDate);
    const start = new Date(createdDate).getTime();
    
    const diffMins = (this.now.getTime() - start) / 60000;

    return {
      'timer-normal': diffMins < this.WARNING_MINUTES,
      'timer-warning blink': diffMins >= this.WARNING_MINUTES
    };
  }

   ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

parseCustomDate(value: string): Date {

  const localDate = new Date(value.replace(' ', 'T'));

  const myDateStr = localDate.toDateString();

  const [datePart, timePart, meridianRaw] = value.split(' ');
  const [hour, minute] = timePart.split(':').map(Number);
  const meridian = meridianRaw.toLowerCase();

  let h = hour;
  if (meridian === 'p.m.' && hour < 12) h += 12;
  if (meridian === 'a.m.' && hour === 12) h = 0;

  return new Date(`${datePart}T${h.toString().padStart(2, '0')}:${minute}`);
}

}
