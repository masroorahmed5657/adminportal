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
import { SearchPipe } from '../pipes/search-pipe.pipe';
import { NgxPrintModule } from 'ngx-print';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [FormsModule, CommonModule, FontAwesomeModule, SearchPipe, NgxPrintModule],
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
  viewMode: 'kitchen' | 'list' = 'kitchen';
  orderSourceType: 'ONLINE' | 'POS' = 'POS';

  currentCurrency = 'USD';

  orderViewList: OrdersMenuView[] = [];

  orderStatus: string[] = ['NEW', 'PRINTED', 'CLOSED', 'REJECTED'];
  ordersItemsList: OrdersItems[] = [];
  deptList: Departments[] = [];
  categoryList: Category[] = [];
  qurbaniResponse: CategoryQty[] = [];
  currentUser: any;

  selectedOrderType = 'PICKUP';
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

  total: any = 0;
  quantity = 0;

  fromDate: any;
  toDate: any;
  currentOrderStatus: string = 'NEW';
  projectName = environment.appName;
  spinnerDataLoad = false;
  isListView: boolean = false;

  now = new Date();
  timerSub!: Subscription;

  WARNING_MINUTES = 15;   // turn red
  CRITICAL_MINUTES = 20; // turn dark red + blink

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  pageSize: number = 20; // same as itemsPerPage before

  private searchPipeInstance = new SearchPipe();

  // FIX: replaces the old hardcoded oldOrderCount/newOrderCount (which were
  // always 1 < 2, so the "new order" sound played on every single refresh).
  // We now remember which order IDs we've already seen and only chime when
  // a genuinely new ID shows up in the latest fetch.
  private knownOrderIds = new Set<any>();

  get filteredOrders(): any[] {
    if (!this.terms) return this.orderViewList;
    return this.searchPipeInstance.transform(this.orderViewList, this.terms);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
  }

  get pagedOrderList(): any[] {
    const start = (this.p - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  setViewMode(mode: 'kitchen' | 'list') {
    this.viewMode = mode;
    this.p = 1;
  }


  onSourceChange(source: 'ONLINE' | 'POS') {
    this.orderSourceType = source;
    this.p = 1;
    // Agar backend ONLINE/POS ke hisaab se alag data deta hai to yahan reload call karein:
    // this.getOrderdata(this.currentOrderStatus, this.orderSourceType);
  }


  goToPage(pg: number) {
    if (pg < 1 || pg > this.totalPages) return;
    this.p = pg;
  }

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

    this.spinnerDataLoad = true;

    this.timerSub = interval(1000).subscribe(() => {
      this.now = new Date();
    });

    setTimeout(function () {
      let t1 = parent.window.localStorage['reload'];
      window.location.reload();
    }, 120000);

    this.searchType = 1;
    let t1 = this.searchType;

    this.startDate = this.cache.get('startDate');
    this.endDate = this.cache.get('endDate');

    let user = sessionStorage.getItem('currentUser');

    if (typeof (user) !== 'undefined' && user !== null && user !== '') {
      this.currentUser = JSON.parse(user);
    }

    this.deptService.getDepList().subscribe((data: Departments[]) => {
      if (data != null || data != undefined) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].activeFlag) {
            this.deptList.push(data[i]);
          }
        }
      }

      this.categoryService.getCategoryList().subscribe((data: Category[]) => {
        this.categoryList = data;
        this.categoryList.sort();

        this.spinnerDataLoad = false;
      });

    });

    this.orderViewList.length = 0;

    let dept = this.cache.get('selectedDepartment');
    // FIX: was comparing dept to the *string* 'undefined', which never
    // matches a real `undefined` value, so this reset silently failed.
    if (dept === null || dept === undefined || dept === 'undefined') {
      this.selectedDepartment = 'ALL';
    }
    else {
      this.selectedDepartment = dept;
      this.cache.set('selectedDepartment', this.selectedDepartment);
    }

    this.getOrderdata(this.currentOrderStatus, this.selectedOrderType);

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

    this.orderService.getTodaysOrders(orderSearch).subscribe({
      next: (data: OrderMenuResponse) => {
        this.errorsFlag = false;
        this.orderViewList = data.orderMenuList;
        if (this.orderViewList !== null) {

          if (this.orderViewList.length) {
            this.orderViewList = [...this.orderViewList].reverse();
            this.p = 1; // 👈 reset to first page on fresh data

            // FIX: real "is there a new order" check instead of the old
            // hardcoded oldOrderCount < newOrderCount (always true).
            const currentIds = this.orderViewList.map((o: any) => o.orderId ?? o.orderNumber);
            const hasNewOrder = currentIds.some((id: any) => !this.knownOrderIds.has(id));

            // Don't chime on the very first load (knownOrderIds is empty then) —
            // only when a genuinely new order appears after the initial fetch.
            if (hasNewOrder && this.knownOrderIds.size > 0) {
              this.playAudio();
            }

            this.knownOrderIds = new Set(currentIds);
          }

          this.spinnerDataLoad = false; // 👈 loader stop
        }
        else {
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
    let myOrder: Orders = order.orders;
    let myCustomer: Customer = order.customer;

    let items: OrdersItemsView[] = [];

    for (let i = 0; i < orderItemProductList.length; i++) {

      if (orderItemProductList[i].ordersItems?.orderId === myOrder.orderId) {
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

    if (datetimeStr === null || datetimeStr === undefined) {
      return '';
    }

    let dtArray = datetimeStr.split(' ');

    let dateOnly = dtArray[0];
    let timeStr = dtArray[1];
    let s1 = timeStr.substring(0, 2);
    let s2 = timeStr.substring(3);
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
  }
  /* ******************************************************** */
  getCss(): string {
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

    let popupWin;
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

        // FIX: was `total + items[i].unitPrice`, ignoring quantity, so any
        // item with quantity > 1 printed a total lower than the real amount.
        total = total + (Number(items[i].unitPrice) || 0) * (Number(items[i].quantity) || 1);
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

    let myOrder: Orders = order.orders;
    let myCustomer: Customer = order.customer;
    let items: OrdersItemsView[] = [];

    for (let i = 0; i < orderItemProductList.length; i++) {

      if (orderItemProductList[i].ordersItems?.orderId === myOrder.orderId) {
        let ordersItemsView: OrdersItemsView = this.orderItemDecorator(orderItemProductList[i].ordersItems, orderItemProductList[i].products);
        items.push(ordersItemsView);
      }

    }//for loop

    let popupWin;
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

      let myHtml = ` <html> ` + myHead;

      let phoneNumber = this.formatPhoneNumber(customer?.phone1);
      let formatDate = this.formatTime(myOrder.createDate);
      let today: Date = new Date();

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
        // FIX: same quantity bug as print() above.
        total = total + (Number(currentItem.unitPrice) || 0) * (Number(currentItem.quantity) || 1);

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

    }//end if


  }//print()


  /* *********************************************************************************** */
  printThermalAuto(order: any, customer: any, items: any): void {

    let popupWin;
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

      let myHtml = ` <html> ` + myHead;

      let phoneNumber = this.formatPhoneNumber(customer?.phone1);
      let formatDate = this.formatTime(order.orders?.createDate);

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
        // FIX: same quantity bug as print() above.
        total = total + (Number(currentItem.unitPrice) || 0) * (Number(currentItem.quantity) || 1);

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

  // FIX: now returns a Promise so exportPDF() can await each PDF before
  // starting the next one (previously all PDFs were generated in parallel
  // and could overwrite/mix up each other's canvas data).
  openPDF(orders: any, DATA: any): Promise<void> {
    return html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(orders.orderNum || orders.orderId);
    });
  }


  /* **************************************************** */
  async exportPDF() {

    let myHtml = '';
    // FIX: was firing all openPDF() calls back-to-back without waiting for
    // the async html2canvas().then(...) inside each one to finish, which
    // could produce PDFs with mismatched/overlapping data. Now awaited
    // sequentially, one order at a time.
    for (let i = 0; i < this.orderViewList.length; i++) {
      myHtml = this.orderDetailHtml(this.orderViewList[i]);
      await this.openPDF(this.orderViewList[i], myHtml);
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

  /* ===== Robust date handling for the kitchen timer ===== */
  private toDateSafe(value: string | Date): Date {
    if (value instanceof Date) return value;
    if (!value) return new Date(NaN);

    // Try native parsing first (handles ISO strings fine)
    const direct = new Date(value);
    if (!isNaN(direct.getTime())) return direct;

    // Fall back to the custom "MM/dd/yyyy h:mm a.m./p.m." parser below
    try {
      return this.parseCustomDate(value);
    } catch {
      return new Date(NaN);
    }
  }

  getElapsedTime(createdDate: string | Date): string {
    const start = this.toDateSafe(createdDate).getTime();
    if (isNaN(start)) return '0:00';

    const diff = Math.max(0, Math.floor((this.now.getTime() - start) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getTimerClass(createdDate: string | Date) {
    const start = this.toDateSafe(createdDate).getTime();
    const diffMins = isNaN(start) ? 0 : (this.now.getTime() - start) / 60000;

    return {
      'timer-normal': diffMins < this.WARNING_MINUTES,
      'timer-warning': diffMins >= this.WARNING_MINUTES && diffMins < this.CRITICAL_MINUTES,
      'timer-critical blink': diffMins >= this.CRITICAL_MINUTES
    };
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  /* ******************************************************************************** */
  /* ******************************************************************************** */
  /* ******************************************************************************** */
  goToDetail(order: any) {

    console.log('RAW ORDER FROM KITCHEN LIST:', order);
    console.log('RAW MENU LIST:', order.menuList);

    let mappedOrders: any = {
      orderId: order.orderId,
      orderNum: order.orderNumber ?? order.orderId,
      orderStatus: order.orderStatus,
      createDate: order.createdDate,
      tax: 0,
      shippingHandling: 0,
      grandTotal: 0
    };

    let mappedItems: any[] = (order.menuList || []).map((item: any) => ({
      orderId: order.orderId,
      orderItemId: item.orderItemId ?? item.orderItemid ?? null,
      // The kitchen payload identifies the product via "itemId", not
      // "productId"/"productid" — confirmed from the raw payload.
      productId: item.productId ?? item.productid ?? item.itemId ?? null,
      productName: item.itemName ?? item.productName ?? '',
      quantity: item.quantity ?? 0,
      // FIX for the $300 kitchen-vs-admin price mismatch:
      // Try every likely field name for price straight from the kitchen payload.
      // Added a few more common variants (orderItemPrice/totalPrice/amount).
      // If NONE of these match, unitPrice falls through to 0, which makes
      // orderdetail.component.ts silently replace it with the product's
      // CURRENT catalog price instead of the price actually charged on this
      // order — that's exactly how 3900 (order price) became 4200 (catalog
      // price) in Order #24.
      unitPrice: item.unitPrice ?? item.price ?? item.sellingPrice ?? item.itemPrice
        ?? item.orderItemPrice ?? item.totalPrice ?? item.amount ?? 0,
      attributes: item.attributes,
      notes: item.notes,
      sku: item.sku ?? '',
      imageMimeType: item.imageMimeType ?? '',
      productImage: item.productImage ?? ''
    }));

    // FIX: if a price still comes out 0 after all the fallbacks above, warn
    // loudly in the console with the raw item, so whoever's debugging can
    // immediately see the real field name to add above — instead of the
    // wrong price silently flowing through to Order Detail.
    mappedItems.forEach((mapped: any, idx: number) => {
      if (!mapped.unitPrice) {
        console.warn(
          'Kitchen item has no matching price field — Order Detail will fall back to the CURRENT catalog price for this item, which can be wrong. Raw item:',
          (order.menuList || [])[idx]
        );
      }
    });

    let mappedCustomer: any = {
      firstName: order.agentName ?? '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      email: '',
      phone1: ''
    };

    this.cache.setList('orders', mappedOrders);
    this.cache.setList('ordersItem', mappedItems);
    this.cache.setList('customer', mappedCustomer);
    this.cache.set('selectedDepartment', this.selectedDepartment);
    this.router.navigate(['/layout/orderdetail']);
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