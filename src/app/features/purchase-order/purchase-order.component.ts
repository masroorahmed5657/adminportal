import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier, PurchaseOrder, POItems, ProductView, POItemsView, POListResponse, ProductWrapper, AdminUser, PORequest, POResponse, POSearch } from '../../shared/models/model-classes.model';
import { ProductsService } from '../../shared/services/products.service';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { SupplierService } from '../../shared/services/supplier.service';
import Swal from "sweetalert2";
import { UtilitiesService } from '../../shared/utilities.service';
import { FormsModule } from '@angular/forms';
import { faReceipt, faPrint, faRemove,  faPencil, faSortAlphaUp, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@Component({
  selector: 'app-purchase-order',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  providers:[DatePipe],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss'
})
export class PurchaseOrderComponent implements OnInit {
  
  searchStatus='';
  faPencil=faPencil;
  faPrint=faPrint;
  faRemove=faRemove;
  faReceipt=faReceipt;
  selectedSupplierName = '';
  suppliertList: Supplier[] = [];
  purchaseOrderList: PurchaseOrder[] = [];
  po: PurchaseOrder = new PurchaseOrder();
  poItems: POItems[] = [];
  selectedSupplier: any;
  productviewList: ProductView[] = [];
  product: ProductView = new ProductView();
  // poDate: any = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  poDate: any;
  remarks: any = '';
  poType: any = "ITEM";
  priceSummary: any;

  faSortAlphaUp=faSortAlphaUp;
  faSort=faSort;

  quantity: any = 0;
  unitPrice: any = 0;
  discount: any = 0;
  total: any = 0.0;
  tax: any = 0.0;
  subTotal: any = 0.0;
  //define up and sku
  sku: any;
  upc: any;
  //cartDataList: any;
  items: any;
  services: any;
  mydata = "Items";
  supplierContactPerson: any;
  itemSearch: any;
  selectedCurrency: any = 'USD';
  mySupplier: Supplier = new Supplier();
  purchaseListFlag = true;
  //purchasehide=false;
  // fromDate: any = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  // toDate: any = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  fromDate: any;
  toDate: any;

  poItemsViewList: POItemsView[] = [];


  /* ****************************************************************** */
  myScan = "";
  myCode = "";
  scanningInProgress = false;
  constructor(
    private supplierService: SupplierService,
    private datepipe: DatePipe,
    private productService: ProductsService,
    private poService: PurchaseOrderService,
    private router: Router,
    private utilities: UtilitiesService
  ) { }

  /* ******************************************************** */
  ngOnInit(): void {

    this.poDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.fromDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.toDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");

    this.myScan = '';
    //UPC scan code at window
    //auto Scaning Code
    //  window.addEventListener('keypress',event=> {

    //   const key = event.key;
    //   const code = event.code;
    //   if (key==='Enter') {

    //     this.upcSearchWindow(this.myScan);
    //     //alert(key)
    //     //console.log('barcodescan:', myScan);
    //     //myScan= '';
    //     }
    //   else {
    //       this.myScan += key;
    //       this.myCode += code;
    //     }
    //   });


    //today date
    /************* */
    //this.purchaseListFlag=true;
    //get the data supplier

        this.fromDate = null;
    this.toDate = null;
    let poResponse: POListResponse = new POListResponse();

    this.supplierService.getSupplierList().subscribe((data: Supplier[]) => {
      let supplier: Supplier = new Supplier();
      this.suppliertList.push(supplier);

      this.suppliertList = data;
      this.suppliertList.unshift(supplier);

      if (data != null || data != undefined) {
        if (this.suppliertList.length > 0) {
          this.selectedSupplier = this.suppliertList[0].supplierCode;
          this.po.supplierId = this.suppliertList[0].supplierId;
          this.mySupplier = this.suppliertList[0];

          this.poService.getMonthly().subscribe((data: POListResponse) => {
            this.purchaseOrderList = data.poList;
            //poResponse = data;
            //this.purchaseOrderList = poResponse.poList;


          });


        }
      }

    });




  }
  /* ************************************************ */

  changea(items: any) {
    this.mydata = 'ITEM';
  }
  changeb(service: any) {
    this.mydata = 'SERVICE';
  }
  //total amount find
  toFixDecimalNumber(quantity: any, unitPrice: any): number {

    let myNumber = this.utilities.truncateToTwoDecimals(Number(quantity * unitPrice)); //.toFixed(2);
    return Number(myNumber);

  }


  //find the data with upc
  /* ****************************************************** */
  barcodeEntry(event: any) {
    if (event.code === 'Enter') {

      this.findProductByUpc();
    }



  }

/* ******************************************************** */

  upcScan = "";
  onKeyupc(event: any) {

    if (event.code === 'Enter') {

      this.findProductByUpc();
    }
    else {
      this.upcScan = event.target.value;
    }

    //alert(this.myScan);

  }
  /* ****************************************************** */
  skuScan = "";
  onKeysku(event: any) {
    //alert(event.target.value);
    //delay(3000);
    if (event.code === 'Enter') {
      //alert(this.myScan);
      //alert('UPC: '+this.sku);
      this.findProductBySku();
    }
    else {
      this.skuScan = event.target.value;
    }

    //alert(this.myScan);

  }

  /* ****************************************************** */
  onKeyItem(event: any) {
    //alert(event.target.value);
    //delay(3000);
    if (event.code === 'Enter') {
      //alert(this.myScan);
      //alert('UPC: '+this.sku);
      this.findProductByItem();

    }
    else {
      this.myScan = event.target.value;
    }

    //alert(this.myScan);

  }
  /* **************************************************** */
  setPoItems(rcvdProduct: ProductView) {
    let poItem = new POItems();
    poItem.productId = rcvdProduct.productId;
    poItem.discount = rcvdProduct.discount;
    poItem.quantity = rcvdProduct.quantity;

    this.poItems.push(poItem);

  }


  /* *************************************************** */
  //find the data with upc
  findProductByUpc() {
    if (this.mySupplier.supplierCode === undefined || this.mySupplier.supplierCode === null) {
      Swal.fire('Warning', 'Please Select Supplier');
      this.upc = '';
      return;
    }
    let upc = this.upc;
    this.productService.getProductsByUPC(this.upc).subscribe((data: ProductView) => {
      this.product = data
      let rcvdProduct = new ProductView();
      rcvdProduct.productId = this.product.productId;
      rcvdProduct.productName = this.product.productName;
      rcvdProduct.productDetails = this.product.productDetails;
      rcvdProduct.quantity = this.product.quantity;
      rcvdProduct.unitPrice = this.product.unitPrice;
      rcvdProduct.tax = this.product.tax;

      rcvdProduct.discount = this.product.discount;
      rcvdProduct.upc = this.upc;
      //rcvdProduct.receivedQty =
      this.productviewList.push(rcvdProduct);

      //Now setup POitems
      this.setPoItems(rcvdProduct);
      //reset upc input
      this.upc = '';
      let i = 0;
    });

  }
  
  /* *************************************************** */
  //find the data with upc
  upcSearchWindow(upc: any) {

    if (upc === null || upc === undefined) {

      alert('hello man')
      return;

    }

    if (this.mySupplier.supplierCode === undefined || this.mySupplier.supplierCode === null) {
      Swal.fire('Warning', 'Please Select Supplier');
      this.upc = '';
      return;
    }
    // alert(upc);
    this.productService.getProductsByUPC(upc).subscribe((data: ProductView) => {
      this.product = data;
      //reset myscan
      this.myCode = '';
      this.myScan = '';
      let rcvdProduct = new ProductView();
      rcvdProduct.productId = this.product.productId;
      rcvdProduct.productName = this.product.productName;
      rcvdProduct.productDetails = this.product.productDetails;
      rcvdProduct.quantity = this.product.quantity;
      rcvdProduct.unitPrice = this.product.unitPrice;
      rcvdProduct.discount = this.product.discount;
      rcvdProduct.upc = this.upc;
      //rcvdProduct.receivedQty =
      this.productviewList.push(rcvdProduct);

      //Now setup POitems
      this.setPoItems(rcvdProduct);
      //reset upc input
      this.upc = '';
      let i = 0;
    });
  }
  
  /* ******************************************************** */
  //find the data with sku
  findProductBySku() {
    if (this.mySupplier.supplierCode === undefined || this.mySupplier.supplierCode === null) {
      Swal.fire('Warning', 'Please Select Supplier');
      this.sku = '';
      return;
    }
    let sku = this.sku;
    this.productService.getProductsBySKU(this.sku).subscribe((data: ProductView[]) => {
      this.product = data[0];
      let rcvdProduct = new ProductView();
      rcvdProduct.productId = this.product.productId;
      rcvdProduct.productName = this.product.productName;
      rcvdProduct.productDetails = this.product.productDetails;
      rcvdProduct.quantity = this.product.quantity;
      rcvdProduct.unitPrice = this.product.unitPrice;
      rcvdProduct.discount = this.product.discount;
      rcvdProduct.sku = this.sku;
      //rcvdProduct.receivedQty =
      this.productviewList.push(rcvdProduct);

      //Now setup POitems
      this.setPoItems(rcvdProduct);

      //reset upc input
      this.sku = '';
      let i = 0;
    });
  }

  /* ******************************************************** */
  findProductByItem() {
    if (this.mySupplier.supplierId === undefined || this.mySupplier.supplierId === null) {
      Swal.fire('Warning', 'Please Select Supplier');
      this.itemSearch = '';
      return;
    }
    let sku = this.sku;
    this.productService.getProductsByItem(this.itemSearch).subscribe((data: ProductWrapper) => {

      let rcvdProduct = new ProductView();
      if (data.productList != null || data.productList != undefined) {
        if (data.productList.length > 0) {
          rcvdProduct = data.productList[0];

          this.productviewList.push(rcvdProduct);

          //Now setup POitems
          this.setPoItems(rcvdProduct);

          //reset itemSearch input
          this.itemSearch = '';

        }
      }

    });
  }


  /* ******************************************************** */
  //select the supplier data with dropdwon

  supplierChange() {
    let mySuppCode = this.selectedSupplier;

    if (mySuppCode === 'undefined') {
      this.po.supplierId = null;
      this.mySupplier.supplierId = null;
    }
    else {
      for (let i = 0; i < this.suppliertList.length; i++) {
        if (mySuppCode === this.suppliertList[i].supplierCode) {
          this.mySupplier = this.suppliertList[i];

          break;
        }
      }
      this.po.supplierId = this.mySupplier.supplierId;

    }
    //alert(this.mySupplier.supplierEmail)
  }
  /* ************************************************************** */
  //clear code function start
  clear() {
    setTimeout(function () {
      let t1 = parent.window.localStorage['reload'];
      window.location.reload();
    }, 10);
  }//end clear functions


  /* ************************************************************* */
  //close code function start
  close() {
    setTimeout(function () {
      let t1 = parent.window.localStorage['reload'];
      window.location.reload();
    }, 10);
  }//clear code function end

  /* ************************************************************ */
  onDelete(row: any) {
    //Ask confirmation msg
    Swal.fire({
      title: 'Are you sure to delete ' + this.productviewList[row].productId + ' ?',
      text: 'You can not un delete!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.value) {
        if (this.poItems[row].productId != null || this.productviewList[row].productId != undefined) {
          this.productviewList.splice(row, 1);
          this.poItems.splice(row, 1);
        }
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Item is safe',
          'error'
        );
      }
    });
  }
  /* ******************************************************* */
  qtyChange(index: number) {

    //let qty = this.cartForm.get('qty')?.value;

    let qty = <HTMLInputElement>(document.getElementById('Qty_' + index));

    //alert('qtyChange'+ qty.value);

    this.productviewList[index].quantity = qty.value;

    this.calculateTotalPrice();
  }

  /* ******************************************************* */
  priceChange(index: number) {

    //let qty = this.cartForm.get('qty')?.value;

    let price = <HTMLInputElement>(document.getElementById('price_' + index));

    let priceNum = Number(price.value);

    this.productviewList[index].unitPrice = priceNum;

    this.calculateTotalPrice();
  }
  /* ******************************************************* */
  discountChange(index: number) {

    //let qty = this.cartForm.get('qty')?.value;

    let discountElem = <HTMLInputElement>(document.getElementById('discount_' + index));

    let discountNum = Number(discountElem.value);

    this.productviewList[index].discount = discountNum;
    this.poItems[index].discount = discountNum;

    this.calculateTotalPrice();
  }

  /* **************************************************************** */
  taxChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let taxElem = <HTMLInputElement>(document.getElementById('tax_' + index));

    let taxNum = Number(taxElem.value);


    this.poItems[index].tax = taxNum; //it is in percentage

    this.calculateTotalPrice();
  }

  /* ********************************************* */
  // toFixDecimalNumber(quantity: any, unitPrice: any): number{

  //   let myNumber = Number( quantity * unitPrice).toFixed(2);
  //   return Number(myNumber);

  // }
  /* ********************************************* */

  calculateTotalPrice() {
    let priceTotal: any = 0;

    let mquantity: any = 0
    for (let i = 0; i < this.productviewList.length; i++) {

      let unitPrice = this.productviewList[i].unitPrice;

      if (unitPrice != undefined) {

        let price = (unitPrice * this.productviewList[i].quantity);
        let discount: any = 0;
        if (this.productviewList[i].discount !== undefined) {
          discount = this.productviewList[i].discount;
        }
        else {
          discount = 0;
        }

        price = price - discount;
        if (this.poItems[i].tax !== undefined) {
          let priceTax = (price * this.poItems[i].tax) / 100;
          this.poItems[i].total = this.utilities.truncateToTwoDecimals(Number(price + priceTax));//.toFixed(2);
        }
        else {
          this.poItems[i].total = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
        }


        priceTotal = priceTotal + this.poItems[i].total;

      }

    }

    let p1 = this.utilities.truncateToTwoDecimals(Number(priceTotal));//.toFixed(2);
    this.po.total = Number(p1);
    this.po.subTotal = p1;


  }
  /* *********************************************** */
  totalDiscountChange() {
    this.po.total = this.po.subTotal - this.po.discount;
  }

  /* ********************************************* */
  chkNumber(row: number, col: string) {

    let qtyInput = <HTMLInputElement>(document.getElementById(col + row));
    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;


      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);

      }

    }

  }//chkNumber

  /* ***************************************************** */

  formToPO() {

    let loggedInUser = new AdminUser();
    loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    this.po.currency = this.selectedCurrency;
    this.po.poStatus = 'OPEN';
    this.po.contactPerson = this.supplierContactPerson;
    this.po.poDate = this.poDate;
    this.po.poType = this.poType;
    this.po.remarks = this.remarks;
    //po.subTotal = this.subTotal;
    //po.discount = this.discount;
    //po.tax = this.tax;
    //po.total = this.total;
    this.po.updatedBy = loggedInUser.loginId;


  }

  /* *************************************************** */
  save() {
    if (this.productviewList.length > 0) {
      //Get and set PurchaseOrder and POItems[]
      let po = new PurchaseOrder();
      //let poItems: POItems[]=[];


      this.formToPO();
      let poRequest: PORequest = new PORequest();
      poRequest.po = this.po;
      poRequest.poItems = this.poItems;

      // save(po: PurchaseOrder, items: POItems[])
      this.poService.save(poRequest).subscribe(
        (resp: POResponse) => {
          resp.po;
          if (resp.po !== null) {
            if (resp.po === undefined) {
              Swal.fire('Error', 'Error in saving Purchase Order', 'error');
            }
            else {
              if (resp.po.poId !== null) {
                Swal.fire('Submit', 'You have saved Purchase Order ' + resp.po.poId + ' Succesfully!', 'success');

                //window.location.reload();
              }
            }
          }

        }

      );
    }
  }

  /****************************************** */
  //funciton list show and hide

  list() {
    this.purchaseListFlag = true;
    //this.purchasehide=true;
  }

  reset() {
    setTimeout(function () {
      let t1 = parent.window.localStorage['reload'];
      window.location.reload();
    }, 10);

  }


  /************************************* */

  search() {

    let poSearch: POSearch = new POSearch();
    let poResponse: POListResponse = new POListResponse();

    if (this.searchStatus!==''){
      poSearch.poStatus = this.searchStatus;
    }
    else{
      poSearch.poStatus=null;
    }
    poSearch.poStartDate = this.fromDate;
    poSearch.poEndDate = this.toDate;
    poSearch.supplierId = this.mySupplier.supplierId === undefined ? null : this.mySupplier.supplierId;

    if (poSearch.poStartDate === null && poSearch.poEndDate === null && poSearch.supplierId === null) {
      Swal.fire("Warning", "Please Select Search options", "warning");
      return;
    }

    this.poService.getBySearch(poSearch).subscribe((data: POListResponse) => {
      poResponse = data;
      this.purchaseOrderList = poResponse.poList;
      //this.poItems = poResponse.poItems;

    });

  }

  /**************************************** */
  //backthecode

  back() {
    this.router.navigate(['home']);
  }

  rcvProduct(po: any) {
    //alert(po.poId);
    // this.cache.setList('orders',purchase);
    this.router.navigate(['receiveProduct/' + po.poId]); //<a routerLink="/shop/6" class="read-more">

  }

  //   detail(){
  //  this.purchaseListFlag=true;
  //   }


  /* ************************************************************ */
  print(po: PurchaseOrder) {

    let printWindow: any;


    //Get PO Items
    this.poService.getPoItem(po.poId).subscribe((data1: POItemsView[]) => {
      this.poItemsViewList = data1;

      let currentSupplierForPrint: Supplier = new Supplier();;
      for (let i = 0; i < this.suppliertList.length; i++) {
        if (po.supplierId === this.suppliertList[i].supplierId) {
          currentSupplierForPrint = this.suppliertList[i];
          break;
        }
      }

      printWindow = window.open('', '_blank');

      let headHtmlTag = `
          <html> 
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let styleTag = `
         <style>
         @media print {
                .no-print { display: none; }
                .page-break {page-break-after: always;
          }
    
          table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              thead {border: 2px solid black;background-color:none;}
              
         </style>
         `;

      let bodyHtmlTag =
        `<title> Purchase Order </title>
         </head>    
         <body  onload="window.print();window.close();">`;

      let divTag = ``;
      divTag = ` <div class="row">
                    <div class="col-12"
                        style="text-align:center ;background-color:#be0b31; font-weight:bolder ; color: white; font-size: medium; padding: 0.5rem 2rem;font-size: 1.0rem;">
                        <label style="color: black; font-size: large;">Purchase Order </label>
                    </div>
                </div>
                <div class="container mt-3">
                    <div class="row">
                        <div class="col-12 col-md-4 col-lg-4 col-sm-4">
                        
                            <label style="color: black; font-size: medium;">Supplier: <strong>`+ currentSupplierForPrint.supplierCode + `</strong></label>&nbsp;
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label class="labelFont">Name: <strong> ` + currentSupplierForPrint.supplierName + `</strong></label>
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>Address: <strong>` + (currentSupplierForPrint.supplierAddress === undefined ? '' : currentSupplierForPrint.supplierAddress) + `</strong></label>
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>Phone: <strong>` + (currentSupplierForPrint.supplierContact === undefined ? '' : currentSupplierForPrint.supplierContact) + `</strong></label>
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>Email: <strong> `+ (currentSupplierForPrint.supplierEmail === undefined ? '' : currentSupplierForPrint.supplierEmail) + `</strong></label>
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>Contact Person: <strong> ` + (currentSupplierForPrint.supplierContact === undefined ? '' : currentSupplierForPrint.supplierContact) + `</strong></label>&nbsp;
                        </div>
                    </div>
                </div>
                <br>
                <div class="container mt-3">
                    <div class="row">
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>PO No: <strong>`+ po.poNumber + ` </strong></label>
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>PO Ref No: <strong>`+ po.poRef + ` </strong></label>
                        </div>

                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>Status: <strong> OPEN</strong></label>
                            
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>PO Date: <strong>`+ po.poDate + `</strong></label>
                            
                        </div>
                        <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                            <label>Currency: <strong>` + po.currency + `</strong></label>
                        </div>
    
                    </div>
                </div>
                <hr>
          
          <div class="table-responsive container mt-3">
                    <table class="table dept-table mb-0 teble-responsive">
                        <thead style="border: 1px solid black;">
                            <tr style="width: 100%; font-size: 15px; text-transform: capitalize;">
    
                                <th scope="col" style="width: 40%;" class="border-1 text-capitalize font-medium">Item</th>
                                <th scope="col" style="width: 10%;" class="border-1 text-capitalize font-medium">Qty</th>
                                <th scope="col" style="width: 10%;" class="border-1 text-capitalize font-medium">Unit Price
                                </th>
                                <th scope="col" style="width: 10%;" class="border-1 text-capitalize font-medium">Discount
                                </th>
                                <th scope="col" style="width: 10%;" class="border-1 text-capitalize font-medium">Amount
                                    After Discount </th>
                                <th scope="col" style="width: 10%;" class="border-1 text-capitalize font-medium">Tax %</th>
                                <th scope="col" style="width: 10%;" class="border-1 text-capitalize font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody style="border: 1px solid black;">`;

      let trTag = ``;
      //this.po.totalQty=0;
      //this.po.subTotal=0;
      let totalQty = 0;

      for (let i = 0; i < this.poItemsViewList.length; i++) {
        trTag += `<tr>
                                          <td>`+ this.poItemsViewList[i].productName +
          `</td>
                                          <td class="border-1 text-capitalize font-medium">`+ this.poItemsViewList[i].quantity + `
                                          </td>
                                          <td class="border-1 text-capitalize font-medium">`+ this.poItemsViewList[i].unitPrice + `
                                          </td>
                                          <td class="border-1 text-capitalize font-medium">`+ this.poItemsViewList[i].discount + `
                                          </td>
                                          <td class="border-1 text-capitalize font-medium">`+ this.poItemsViewList[i].total + `
                                          </td>
                                          <td class="border-1 text-capitalize font-medium">`+ this.poItemsViewList[i].tax + `
                                          </td>
                                          <td class="border-1 text-capitalize font-medium">`+ this.poItemsViewList[i].grandTotal + `
                                          </td>
                                      </tr>`;
        totalQty = totalQty + Number(this.poItemsViewList[i].quantity);
        //this.po.subTotal = this.po.subTotal + this.poItemsViewList[i].grandTotal;
        //this.po.total = this.po.total - po.discount;

      }//for loop for TR

      let currencySign = '$';
      if (po.currency === 'USD') {
        currencySign = '$';
      }
      else if (po.currency === 'CAD') {
        currencySign = '$';
      }
      else if (po.currency === 'PKR') {
        currencySign = 'Rs';
      }


      let tfootTag = ``;
      tfootTag = `                    </tbody>
                        <tfoot style="border: 1px solid;">
                            <tr class="mt-3 mb-3">
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
    
                                <td style="border:none; text-align:right" colspan="2">Sub Total(` + currencySign + `)</td>
                                <td >`+ (po.subTotal === undefined ? 0 : po.subTotal) + `</td>
                            </tr>
                            <tr class="mt-3 mb-3">
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none;text-align:right" colspan="2">Discount(` + currencySign + `):</td>
                                <td >`+ (po.discount === undefined ? 0 : po.discount) + `
                                </td>
                            </tr>
                             <tr class="mt-3 mb-3">
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none;text-align:right" colspan="2">Total Qty:</td>
                                <td >`+ (totalQty === undefined ? 0 : totalQty) + `
                                </td>
                            </tr>
                            <tr class="mt-3 mb-3">
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none"></td>
                                <td style="border:none;text-align:right" colspan="2">Total Payment Due(` + currencySign + `):</td>
                                <td >`+ (po.total === undefined ? 0 : po.total) + `</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="container mt-3">
                    <div class="row">
                        <div class="col-12 col-md-4 col-lg-4 col-sm-4">
                            <label>Remarks:`+ (po.remarks === undefined ? '' : po.remarks) + `</label>
                        </div>
                    </div>
                </div>
            `;

      let footerHtml =
        `</body>
         </html>
           `;

      let finalHTMLTag = headHtmlTag +
        styleTag +
        bodyHtmlTag +
        divTag + trTag + tfootTag +
        footerHtml;
      printWindow.document.open();
      printWindow.document.write(finalHTMLTag);

      printWindow.document.close();


    });

  }

  /* ******************************************************** */
  addPurchase() {
    this.router.navigate(['/layout/purchase-order-add']);
  }

/* ******************************************************** */
  getSupplierInfo(supplierId: number) {
    let supplierInfo = '';

    for (let i = 0; i < this.suppliertList.length; i++) {
      if (this.suppliertList[i].supplierId === supplierId) {
        supplierInfo = this.suppliertList[i].supplierCode + ' - ' + this.suppliertList[i].supplierName;
        break;

      }

    }

    return supplierInfo;

  }

  /* ******************************************************** */
  onDeletePO(row: number, poId:any) {
    //this.purchaseListFlag=false;
    //Ask confirmation msg
    Swal.fire({
      title: 'Are you sure to delete PO ' + poId + ' ?',
      text: 'You can not un delete!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.value) {
        if (poId != null || poId != undefined) {

          this.poService.delete(poId).subscribe((data: any) => {
            this.purchaseOrderList.splice(row, 1);
            this.poItems.splice(row, 1);
            //this.purchaseOrderList.splice(row, 1);
            //window.location.reload();
          })

        }
      }
      else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your PO is safe',
          'error'
        );
      }
    });


  }

  /* ******************************************************** */
  onEdit(row: number) {
    //this.purchaseListFlag=false;
    let poId = this.purchaseOrderList[row].poId;
    let url = '/layout/purchase-order-edit/' + poId;

    this.router.navigate(['/layout/purchase-order-edit/' + poId]);
    //this.router.navigate(['/layout/purchase-order-add']);


  }

  /* ******************************************************** */
  receive(row: number) {
    //this.purchaseListFlag=false;
    let poId = this.purchaseOrderList[row].poId;
    let url = '/layout/receive-order-edit/' + poId;

    this.router.navigate(['/layout/receive-order-edit/' + poId]);
    //this.router.navigate(['/layout/purchase-order-add']);


  }


  /* ******************************************************** */
  sortAsc: boolean = false;

  sort(colName: any) {
    if (colName === 'poDate') {

      if (this.sortAsc) {
        this.purchaseOrderList.sort((a, b) => a.poDate > b.poDate ? 1 : a.poDate < b.poDate ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.purchaseOrderList.sort((a, b) => a.poDate < b.poDate ? 1 : a.poDate > b.poDate ? -1 : 0);
        this.sortAsc = true;
      }
    }

    if (colName === 'poId') {
      if (this.sortAsc) {
        this.purchaseOrderList.sort((a, b) => a.poId! > b.poId! ? 1 : a.poId! < b.poId! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.purchaseOrderList.sort((a, b) => a.poId! < b.poId! ? 1 : a.poId! > b.poId! ? -1 : 0);
        this.sortAsc = true;
      }

    }
    if (colName === 'poNumber') {
      if (this.sortAsc) {
        this.purchaseOrderList.sort((a, b) => a.poNumber! > b.poNumber! ? 1 : a.poNumber! < b.poNumber! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.purchaseOrderList.sort((a, b) => a.poNumber! < b.poNumber! ? 1 : a.poNumber! > b.poNumber! ? -1 : 0);
        this.sortAsc = true;
      }

    }
  }
/* ******************************************************** */
  supplierName(event: any) {
    let data = event.key;

    if (event.keyCode === 16) {
      return;
    }
    if (event.keyCode === 17) {
      return;
    }
    if (event.keyCode === 18) {
      return;
    }
    //let myResult = this.wildcardMatchRegExp("Farhan", "**F**");  

    //this.suppliertList.includes(this.selectedSupplierName);
    let pattern = "**" + this.selectedSupplierName + "**";
    pattern = pattern.toLocaleLowerCase();

    //let search = supplier.supplierName.toLowerCase();
    let mySupplier = this.suppliertList[0];
    mySupplier = this.suppliertList.find(supplier => (this.wildcardMatchRegExp(supplier.supplierName, pattern)))!;

    this.selectedSupplier = mySupplier?.supplierCode;
    this.mySupplier = mySupplier;

    //console.log(this.selectedSupplier.supplierName);
  }

/* ******************************************************** */

  wildcardMatchRegExp(text: string, pattern: string) {
    if (text !== undefined) {
      text = text.toLocaleLowerCase();
    }
    else {
      return false;
    }

    // Convert wildcard pattern to a  
    // regular expression pattern 
    const regexPattern = new RegExp(
      "^" +
      pattern
        .replace(/\?/g, ".")
        .replace(/\*/g, ".*") +
      "$"
    );

    // Test if the text matches the 
    // regular expression pattern 
    return regexPattern.test(text);
  }

}
