import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Supplier, PurchaseOrder, POItems, ProductView, PORequest, POResponse, AdminUser, BarcodeResponse, Product } from '../../shared/models/model-classes.model';
import { ProductsService } from '../../shared/services/products.service';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { SupplierService } from '../../shared/services/supplier.service';
import { UtilitiesService } from '../../shared/utilities.service';
import Swal from "sweetalert2";
import {faBarcode, faList, faPlusSquare, faRupeeSign, faDashboard, faRemove, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BarcodesService } from '../../shared/services/barcodes.service';



@Component({
  selector: 'app-purchase-order-add',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  providers: [DatePipe],
  templateUrl: './purchase-order-add.component.html',
  styleUrl: './purchase-order-add.component.scss'
})
export class PurchaseOrderAddComponent implements OnInit {

  searchStatus='OPEN';
  searchText = '';
  search: string = '';
  productList: Product[] = [];
  faRemove=faRemove;
  faSave=faSave;
  faList = faList;
  faBarcode = faBarcode;
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
  faDollar = faDollar;

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
  fromDate: any;

  /* ****************************************************************** */
  myScan = "";
  myCode = "";
  poNumber: any = "";

  constructor(
    private supplierService: SupplierService,
    private datepipe: DatePipe,
    private productService: ProductsService,
    private poService: PurchaseOrderService,
    private router: Router,
    private barcodeService: BarcodesService,
    private utilities: UtilitiesService
  ) { }

  ngOnInit(): void {

    this.poDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");

    this.fromDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");

    //Init Totals
    this.po.totalQty = 0;
    this.po.discount = 0;
    this.po.quantity = 0;
    this.po.subTotal = 0;


    this.quantity = 0;
    this.tax = 0;
    this.supplierService.getSupplierList().subscribe((data: Supplier[]) => {
      this.suppliertList = data;
      if (data != null || data != undefined) {
        if (this.suppliertList.length > 0) {
          this.selectedSupplier = this.suppliertList[0].supplierCode;
          this.po.supplierId = this.suppliertList[0].supplierId;
          this.mySupplier = this.suppliertList[0];

        }
      }

    });

    this.myScan = '';

  }
  /* ******************************************* */
  supplierChange() {
    let mySuppCode = this.selectedSupplier;
    // let mySupplier;
    let t1 = 0;
    for (let i = 0; i < this.suppliertList.length; i++) {
      if (mySuppCode === this.suppliertList[i].supplierCode) {
        this.mySupplier = this.suppliertList[i];
        break;
      }
    }
    this.po.supplierId = this.mySupplier.supplierId;

    //alert(this.mySupplier.supplierEmail)
  }
  /* ******************************************* */

  changePoType(items: any) {
    this.poType = 'ITEM';
  }

  /* ************************************************************** */
  upcSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
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
        rcvdProduct.salePrice = this.product.salePrice;
        rcvdProduct.tax = this.product.tax;
        rcvdProduct.sku = this.product.sku;

        this.po.totalQty = Number(this.po.totalQty); //+ Number(this.product.quantity);

        rcvdProduct.discount = (this.product.discount === null ? 0 : this.product.discount);
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
  }

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

  /* **************************************************** */
  setPoItems(rcvdProduct: ProductView) {
    let poItem = new POItems();
    poItem.productId = rcvdProduct.productId;
    poItem.discount = rcvdProduct.discount;
    poItem.quantity = 0;
    poItem.discount = 0;
    poItem.unitPrice = rcvdProduct.unitPrice;
    poItem.tax = 0;

    this.poItems.push(poItem);

  }


  /* ********************************************* */
  chkPrice(row: number) {

    return;
    // let qtyInput = <HTMLInputElement>document.getElementById('price_' + row);
    // let val = qtyInput.value;

    // if (qtyInput != null || qtyInput != undefined) {
    //   let len = qtyInput.value.length;

    //   let qty = Number(val);
    //   if (qty < 1) {
    //     //0 or below not allowed
    //     Swal.fire('WARNING', '0 or negative Price is not allowed', 'warning');
    //     return;

    //   }
    // }

  }//chkNumber


  /* ******************************************************* */
  priceChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let price = <HTMLInputElement>(document.getElementById('price_' + index));

    let priceNum = Number(price.value);

    this.productviewList[index].unitPrice = priceNum;
    this.productviewList[index].salePrice = priceNum;

    this.calculateTotalPrice();
  }

  /* ********************************************* */


  calculateTotalPrice() {
    let priceTotal: any = 0;

    let mquantity: any = 0
    this.po.totalQty = 0;//reset
    for (let i = 0; i < this.productviewList.length; i++) {

      let unitPrice = this.productviewList[i].unitPrice;

      if (unitPrice != undefined) {

        let price = (unitPrice * this.productviewList[i].quantity);
        this.poItems[i].unitPrice = unitPrice;
        let discount: any = 0;
        if (this.productviewList[i].discount !== undefined) {
          discount = this.productviewList[i].discount;
        }
        else {
          discount = 0;
        }

        price = price - discount;
        if (this.productviewList[i].tax !== undefined) {
          this.poItems[i].tax = this.productviewList[i].tax;
          let priceTax = (price * this.poItems[i].tax) / 100;
          this.poItems[i].taxAmount = priceTax;
          this.poItems[i].grandTotal = this.utilities.truncateToTwoDecimals(Number(price + priceTax));//.toFixed(2);
          this.poItems[i].total = this.utilities.truncateToTwoDecimals(Number(price));//.toFixed(2);
        }
        else {
          this.poItems[i].taxAmount = 0;
          this.poItems[i].total = this.utilities.truncateToTwoDecimals(Number(price));//.toFixed(2);
          this.poItems[i].grandTotal = this.utilities.truncateToTwoDecimals(Number(price));//.toFixed(2);
        }

        this.po.totalQty = Number(this.po.totalQty) + Number(this.productviewList[i].quantity);
        this.po.discount = Number(this.po.discount) + Number(this.productviewList[i].discount);

        priceTotal = priceTotal + Number(this.poItems[i].grandTotal);

      }

    }

    let p1 = this.utilities.truncateToTwoDecimals(Number(priceTotal));//.toFixed(2);
    this.po.total = Number(p1);
    this.po.subTotal = p1;


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

  /* *********************************************** */
  totalDiscountChange() {
    this.po.total = this.po.subTotal - this.po.discount;
  }
  /* *************************************************** */
  checkItems(poItems: POItems[]) {
    let retVal: boolean = true;//default is true
    let counter = 1;
    for (let i = 0; i < poItems.length; i++) {
      //CHECK QTY
      if (poItems[i].quantity === undefined) {
        retVal = false;
        Swal.fire('WARNING', 'Quantity for Items ' + counter + ' can not be Null or 0', 'warning');
        break;
      }
      if (poItems[i].quantity === '') {
        retVal = false;
        Swal.fire('WARNING', 'Quantity for Items ' + counter + ' can not be Null or 0', 'warning');
        break;
      }
      if (poItems[i].quantity === 0) {
        retVal = false;
        Swal.fire('WARNING', 'Quantity for Items ' + counter + ' can not be Null or 0', 'warning');
        break;
      }

      //Check UnitPrice
      if (poItems[i].unitPrice === undefined) {
        retVal = false;
        Swal.fire('WARNING', 'UnitPrice for Items ' + counter + ' can not be Null or 0', 'warning');
        break;
      }
      if (poItems[i].unitPrice === '') {
        retVal = false;
        Swal.fire('WARNING', 'UnitPrice for Items ' + counter + '  can not be Null or 0', 'warning');
        break;
      }

      if (poItems[i].unitPrice === 0) {
        retVal = false;
        Swal.fire('WARNING', 'UnitPrice for Items ' + counter + '  can not be Null or 0', 'warning');
        break;
      }

      counter++;




    }

    return retVal;
  }


  /* *************************************************** */
  save() {
    if (this.productviewList.length > 0) {
      //Get and set PurchaseOrder and POItems[]
      let po = new PurchaseOrder();
      //let poItems: POItems[]=[];

      //Convert Form to Request Object
      this.formToPO();

      let purchaseQtyAdjFlag = environment.purchaseQtyAdjFlag;
      let poRequest: PORequest = new PORequest();
      poRequest.po = this.po; //PO Master

      //New request by Zubaida client to add Qty in Inventory during purchase
      poRequest.purchaseQtyAdjFlag = purchaseQtyAdjFlag;

      if (this.checkItems(this.poItems)) {
        poRequest.poItems = this.poItems; //PO Items

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
                  this.router.navigate(['/layout/purchase-order']);

                  //window.location.reload();
                }
              }
            }

          }

        );

      }

    }
  }

  /* ***************************************************** */

  formToPO() {



    let loggedInUser = new AdminUser();
    loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    this.po.currency = this.selectedCurrency;
    this.po.poStatus = 'OPEN';
    this.po.contactPerson = this.supplierContactPerson;
    this.po.poDate = this.poDate;
    this.po.poType = this.poType;
    //this.po.remarks = this.remarks;
    //this.po.subTotal = this.subTotal;
    //this.po.discount = this.discount;
    //po.tax = this.tax;
    //this.po.total = this.total;
    this.po.poNumber = this.poNumber;
    this.po.updatedBy = loggedInUser.loginId;
    this.po.supplierId = this.mySupplier.supplierId;


  }

  poList() {
    this.router.navigate(['/layout/purchase-order']);
  }
  /* ********************************************* */
  chkNumber(row: number) {

    let colName = 'qty_' + row;
    // let qtyInput = <HTMLInputElement>document.getElementById(colName);

    const qtyInput = (document.getElementById(colName) as HTMLInputElement);

    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      if (qty < 1) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative Qty is not allowed', 'warning');
        return;

      }
    }

  }//chkNumber
  /* ******************************************************* */
  qtyChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let qty = <HTMLInputElement>(document.getElementById('qty_' + index));

    if (qty.value !== undefined) {
      if (Number(qty.value) < 0) {
        qty.value = '0';
        Swal.fire('Warning', 'Qty should be positive value', 'error');
      }
    }

    this.productviewList[index].quantity = qty.value;
    this.poItems[index].quantity = qty.value;

    this.calculateTotalPrice();
    this.getQty(index);
  }

  /* ******************************************************* */

  print() {
    let printWindow: any;
    const printContentObj = document.getElementById('po_id');




    const printContent = printContentObj?.innerHTML;


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
      `<title>Daily Sale Report</title>
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
                        <label style="color: black; font-size: medium;">Supplier: <strong>`+ this.mySupplier.supplierCode + `</strong></label>&nbsp;
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label class="labelFont">Name: <strong> ` + this.mySupplier.supplierName + `</strong></label>
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Address: <strong>` + (this.mySupplier.supplierAddress === undefined ? '' : this.mySupplier.supplierAddress) + `</strong></label>
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Phone: <strong>` + (this.mySupplier.supplierContact === undefined ? '' : this.mySupplier.supplierContact) + `</strong></label>
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Email: <strong> `+ (this.mySupplier.supplierEmail === undefined ? '' : this.mySupplier.supplierEmail) + `</strong></label>
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Contact Person: <strong> ` + (this.supplierContactPerson === undefined ? '' : this.supplierContactPerson) + `</strong></label>&nbsp;
                    </div>
                </div>
            </div>
            <br>
            <div class="container mt-3">
                <div class="row">
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>PO No: <strong>`+ this.poNumber + ` </strong></label>
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Status: <strong> OPEN</strong></label>
                        
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>PO Date: <strong>`+ this.poDate + `</strong></label>
                        
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Currency: <strong>` + this.selectedCurrency + `</strong></label>
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
    for (let i = 0; i < this.productviewList.length; i++) {
      trTag += `<tr>
                                      <td>`+ this.productviewList[i].productName + `-` + this.productviewList[i].upc +
        `</td>
                                      <td class="border-1 text-capitalize font-medium">`+ this.productviewList[i].quantity + `
                                      </td>
                                      <td class="border-1 text-capitalize font-medium">`+ this.productviewList[i].salePrice + `
                                      </td>
                                      <td class="border-1 text-capitalize font-medium">`+ this.productviewList[i].discount + `
                                      </td>
                                      <td class="border-1 text-capitalize font-medium">`+ this.poItems[i].total + `
                                      </td>
                                      <td class="border-1 text-capitalize font-medium">`+ this.productviewList[i].tax + `
                                      </td>
                                      <td class="border-1 text-capitalize font-medium">`+ this.poItems[i].grandTotal + `
                                      </td>
                                  </tr>`;
    }//for loop for TR

    let tfootTag = ``;
    tfootTag = `                    </tbody>
                    <tfoot style="border: 1px solid;">
                        <tr class="mt-3 mb-3">
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>

                            <td style="border:none; text-align:right" colspan="2">SUBTOTAL:$</td>
                            <td >`+ (this.po.subTotal === undefined ? 0 : this.po.subTotal) + `</td>
                        </tr>
                        <tr class="mt-3 mb-3">
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none;text-align:right" colspan="2">Discount:$</td>
                            <td >`+ (this.po.discount === undefined ? 0 : this.po.discount) + `
                            </td>
                        </tr>
                        <tr class="mt-3 mb-3">
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none;text-align:right" colspan="2">Total Payment Due:$</td>
                            <td >`+ (this.po.total === undefined ? 0 : this.po.total) + `</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="container mt-3">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-4 col-sm-4">
                        <label>Remarks:`+ (this.po.remarks === undefined ? '' : this.po.remarks) + `</label>
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

  }

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

  barcodeFlag = false;
  modalOpen: boolean = false;
  number_loop: any;
  itemQty: any = 0;

  /* ********************************************************** */
  generateBarCode() {
    this.barcodeFlag = true;
    this.modalOpen = true;
    for (let i = 0; i < this.productviewList.length; i++) {
      let width: number = 190;
      let height: number = 35;
      let barCode = this.productviewList[i].upc;

      this.barcodeService.get2DBarCode8WithSize(barCode, width, height).subscribe((data: BarcodeResponse) => {
        this.productviewList[i].firstImage = data.image;

      });


    }
  }


  printBarcodesOnPrinter() {

  }

  /* ******************************************************************** */
  closeModal() {
    this.modalOpen = false;
    //this.clearFields();
  }


  getQty(row: any): any {
    let colName = 'qty_' + row;
    let qty = 0;
    let qtyInput = <HTMLInputElement>document.getElementById(colName);
    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      qty = Number(val);

      this.number_loop = Array(qty).fill(0).map((x, i) => i);
      this.itemQty = qty;

    }
    return this.number_loop;

  }

  getQtyInList(row: any): any {
    let colName = 'qty_' + row;
    let qty = 0;
    let qtyInput = <HTMLInputElement>document.getElementById(colName);
    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      qty = Number(val);

    }
    return qty;

  }


  printBarcode() {

    let htmlTag = `
    <html>
      <head>
        <title></title>
        <style>
           body { width: 5.1in; background:#e8e8e8; }
          
          .label{border: 0px solid black;
          width: 2.40in; height: 1.41in;   margin-right: .10in;  margin-bottom: .10in; 
          float: left; text-align: center; overflow: hidden; background:#fff; outline: 0px dotted #999;
          font-size: 22px; font-family: 'calibri';
          }
          .page-break { clear: left; display:block; page-break-after:always; }

          @media print {
            .hidden-print,
            .hidden-print * {
            display: none !important;
          }
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          }
        </style>

      </head>
      <body onload="window.print();window.close()">`;

    let footerTag = ` </body>
    </html>`;

    let divTag = ``;
    for (let i = 0; i < this.productviewList.length; i++) {
      let qtyLen = this.getQtyInList(i);
      for (let j = 0; j < qtyLen; j++) {

        let width: number = 190;
        let height: number = 35;

        let product = this.productviewList[i];
        let lenOfName: any = 30;
        lenOfName = (product.productName)?.length;

        let fontSize = 12;
        let itemNameLabel = '';
        if (lenOfName < 30) {
          fontSize = 12;
          itemNameLabel = `<p style="margin-top: -0.5;font-size: 16px !important; font-family: 'Times New Roman';">` + product.productName +
            `(` + product.sku + `)</p>`;
        }
        else {
          fontSize = 11;
          itemNameLabel = `<p style="margin-top: -0.5;font-size: 13px !important; font-family: 'Times New Roman';">` + product.productName +
            `(` + product.sku + `)</p>`;
        }
        divTag = divTag + `<div class="label">` + itemNameLabel +

          // `<br>` +
          //`<p style="font-size:small; padding:0 0 0 0;  font-family: 'calibri'">` + product.sku + `</p>` +
          // `<br>` +                 
          `<img style="margin-top: -8;"  src='data:image/png;base64,` + product.firstImage + `'>
                 <br>`
          + `<label style="style="font-size:30px !important;font-weight: bolder;">` + product.upc + `</label>` +
          `<br> <label style="style="font-size:20px !important;font-weight: bolder;">
                 Rs. `+ (product.salePrice) + `</label>` +

          `</div>
         
        `;


      } //for loop j
    }//for loop i

    let finalTag = htmlTag + divTag + footerTag;
    // alert(finalTag);

    let popupWin = window.open('', '_blank');
    popupWin?.document.open();
    popupWin?.document.write(finalTag);

    popupWin?.document.close();
    this.modalOpen = false;

  }

  currencyChange() {
    if (this.selectedCurrency === 'USD') {
      this.faDollar = faDollar;
    }
    else if (this.selectedCurrency === 'CAD') {
      this.faDollar = faDollar;
    }
    else if (this.selectedCurrency === 'PKR') {
      this.faDollar = faRupeeSign;
    }


  }

  onNameSearch(event: any) {
    const value = event.target.value.trim();

    if (value.length < 4) {
      this.productList = [];
      return;
    }

    this.productService.getSearchProducts(value)
      .subscribe((res: any[]) => {
        this.productList = res;
      });
  }


  nameSearchKey() {

    let productView: ProductView[] = [];
    //this.onSearch();
    let nameSearch = <HTMLInputElement>document.getElementById('name-search');
    this.search = nameSearch.value;

    if (this.search === null || this.search === undefined || this.search === '') {
      //Don't do anything
    }
    else {
      this.productService.getSearchProducts(this.search).subscribe((data) => {
        //let productId = data.productId;
        this.productList
        productView = data;



        if (productView === null) {
          Swal.fire(
            'Not Found',
            'Product Does not exist for this UPC',
            'error'
          );

        }
        else if (productView !== null || productView !== undefined) {


          //alert('Product List: ' + productView.length);

        }

      });

    }

  }
  /* *************************************************** */
  selectProduct(product: any) {
    //this.selectedProduct = product;
    this.searchText = product.name;   // show selected name in input
    this.productList = [];            // hide dropdown

    this.product = product;
    //this.commonAdditionToCart(product);
    let rcvdProduct = new ProductView();
    rcvdProduct.productId = this.product.productId;
    rcvdProduct.productName = this.product.productName;
    rcvdProduct.productDetails = this.product.productDetails;
    rcvdProduct.quantity = this.product.quantity;
    rcvdProduct.unitPrice = this.product.unitPrice;
    rcvdProduct.salePrice = this.product.salePrice;
    rcvdProduct.tax = this.product.tax;
    rcvdProduct.sku = this.product.sku;

    this.po.totalQty = Number(this.po.totalQty); //+ Number(this.product.quantity);

    rcvdProduct.discount = (this.product.discount === null ? 0 : this.product.discount);
    rcvdProduct.upc = this.upc;
    //rcvdProduct.receivedQty =
    this.productviewList.push(rcvdProduct);

    //Now setup POitems
    this.setPoItems(rcvdProduct);


  }



  /* **************** LAST Section ******************* */
}
