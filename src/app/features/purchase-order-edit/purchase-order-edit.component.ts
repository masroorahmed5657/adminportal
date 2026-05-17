import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, PurchaseOrder, POItemsView, ProductView, POResponse, PORequest, AdminUser, Product } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { ProductsService } from '../../shared/services/products.service';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { SupplierService } from '../../shared/services/supplier.service';
import { UtilitiesService } from '../../shared/utilities.service';
import { faList, faPrint, faTrash, faPlusSquare, faRupeeSign, faDashboard, faRemove, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-purchase-order-edit',
  imports: [ CommonModule, FormsModule, FontAwesomeModule],
  providers:[DatePipe],
  templateUrl: './purchase-order-edit.component.html',
  styleUrl: './purchase-order-edit.component.scss'
})
export class PurchaseOrderEditComponent implements OnInit {
  faSave=faSave;
  faPrint = faPrint;
  faList=faList;
  faDollar = faDollar;
  faTrash=faTrash;
    searchText = '';
    search: string = '';
    productList: Product[] = [];
    faRemove=faRemove;
  

  selectedCurrency='PKR';
  selectedSupplierName = '';
  suppliertList: Supplier[] = [];
  purchaseOrderList: PurchaseOrder[] = [];
  po: PurchaseOrder = new PurchaseOrder();
  // poItems: POItems[] = [];
  poItemsViewList: POItemsView[] = [];
  selectedSupplier: any;
  //poItemsViewList: ProductView[] = [];
  product: ProductView = new ProductView();
  // poDate: any = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  poDate: any;
  remarks: any = '';
  poType: any = "ITEM";
  priceSummary: any;

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
  //selectedCurrency: any = 'USD';
  mySupplier: Supplier = new Supplier();
  purchaseListFlag = true;
  //purchasehide=false;
  // fromDate: any = this.datepipe.transform(new Date(), "yyyy-MM-dd");
  fromDate: any;
  disablePO=false;

  /* ****************************************************************** */
  myScan = "";
  myCode = "";
  poNumber: any = "";

  constructor(
    private route: ActivatedRoute,
    private cache: CacheService,
    private supplierService: SupplierService,
    private datepipe: DatePipe,
    private productService: ProductsService,
    private poService: PurchaseOrderService,
    private router: Router,
    private utilities: UtilitiesService
  ) { }

  ngOnInit(): void {

    let poId: number = Number(this.route.snapshot.paramMap.get('purchaseOrderId'));
    this.poDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.fromDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");


    //this.selectedCurrency = environment.currencyName;




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

    this.poService.getPo(poId)
      .subscribe((data: PurchaseOrder) => {
        this.po = data;

        if (this.po.poStatus!=='OPEN'){
          this.disablePO = true;
        }
        else{
          this.disablePO = false;
        }

        this.poService.getPoItem(poId).subscribe((data1: POItemsView[]) => {
          this.poItemsViewList = data1;

          this.po.totalQty = 0;
          for (let i = 0; i < this.poItemsViewList.length; i++) {
            this.po.totalQty += this.poItemsViewList[i].quantity;
          }

          this.selectedCurrency = this.po.currency;
          if (this.selectedCurrency === 'USD') {
            this.faDollar = faDollar;
          }
          else if (this.selectedCurrency === 'CAD') {
            this.faDollar = faDollar;
          }
          else if (this.selectedCurrency === 'PKR') {
            this.faDollar = faRupeeSign;
          }


          for (let i = 0; i < this.suppliertList.length; i++) {
            if (this.po.supplierId === this.suppliertList[i].supplierId) {
              this.selectedSupplier = this.suppliertList[i].supplierCode;
              this.mySupplier = this.suppliertList[i];

            }
          }

          //this.calculateTotalPrice();

        });


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
        let rcvdProduct = new POItemsView();
        rcvdProduct.productId = this.product.productId;
        rcvdProduct.productName = this.product.productName;
        //rcvdProduct.productDetails = this.product.productDetails;
        rcvdProduct.quantity = this.product.quantity;
        rcvdProduct.unitPrice = this.product.unitPrice;
        rcvdProduct.tax = this.product.tax;
        rcvdProduct.poId = this.po.poId;
        rcvdProduct.grandTotal = 0;
        this.po.totalQty = Number(this.po.totalQty) + Number(this.product.quantity);

        rcvdProduct.discount = (this.product.discount === null ? 0 : this.product.discount);
        //rcvdProduct. .upc = this.upc;
        //rcvdProduct.receivedQty =
        this.poItemsViewList.push(rcvdProduct);

        //Now setup POitems
        //this.setPoItems(rcvdProduct);
        //reset upc input
        this.upc = '';
        let i = 0;
        this.calculateTotalPrice();
      });
    }
  }

  /* ************************************************************ */
  onDelete(row: any) {
    //Ask confirmation msg
    Swal.fire({
      title: 'Are you sure to delete ' + this.poItemsViewList[row].productName + ' ?',
      text: 'You can not un delete!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.value) {
        if (this.poItemsViewList[row].productId != null || this.poItemsViewList[row].productId != undefined) {
          if (this.poItemsViewList[row].poItemId === undefined) {
            //This item was not saved in DB
            this.poItemsViewList.splice(row, 1);
            this.calculateTotalPrice();
          }
          else {
            this.poService.deletePoItem(this.poItemsViewList[row].poItemId).subscribe((data1: POResponse) => {
              let ret = data1;
              this.poItemsViewList.splice(row, 1);
              this.calculateTotalPrice();
            });

          }



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
  // setPoItems(rcvdProduct: ProductView) {
  //   let poItem = new POItems();
  //   poItem.productId = rcvdProduct.productId;
  //   poItem.discount = rcvdProduct.discount;
  //   poItem.quantity = rcvdProduct.quantity;

  //   this.poItems.push(poItem);

  // }

  /* ********************************************* */
  chkNumber(row: number) {

    let colName = 'Qty_' + row;
    let qtyInput = <HTMLInputElement>document.getElementById(colName);
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
    // if (len > 2) {
    //   qtyInput.value = qtyInput.value.toString().slice(0, 2);
    // }

  }//chkNumber
  /* ********************************************* */
  chkPrice(row: number) {

    let qtyInput = <HTMLInputElement>document.getElementById('price_' + row);
    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      if (qty < 1) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative Price is not allowed', 'warning');
        return;

      }
    }
    // if (len > 2) {
    //   qtyInput.value = qtyInput.value.toString().slice(0, 2);
    // }

  }//chkNumber


  /* ******************************************************* */
  priceChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let price = <HTMLInputElement>(document.getElementById('price_' + index));

    let priceNum = Number(price.value);

    this.poItemsViewList[index].unitPrice = priceNum;

    this.calculateTotalPrice();
  }

  /* ********************************************* */

  calculateTotalPrice() {
    let priceTotal: any = 0;

    let mquantity: any = 0
    this.po.totalQty = 0;//reset
    for (let i = 0; i < this.poItemsViewList.length; i++) {

      let unitPrice = this.poItemsViewList[i].unitPrice;

      if (unitPrice != undefined) {

        let price = (unitPrice * this.poItemsViewList[i].quantity);
        //this.poItems[i].unitPrice = unitPrice;
        let discount: any = 0;
        if (this.poItemsViewList[i].discount !== undefined) {
          discount = this.poItemsViewList[i].discount;
        }
        else {
          discount = 0;
        }

        price = price - discount;
        if (this.poItemsViewList[i].tax !== undefined) {
          //this.poItems[i].tax = this.poItemsViewList[i].tax;
          let priceTax = (price * this.poItemsViewList[i].tax) / 100;
          this.poItemsViewList[i].taxAmount = priceTax;
          this.poItemsViewList[i].grandTotal = this.utilities.truncateToTwoDecimals(Number(price + priceTax)); //.toFixed(2);
          this.poItemsViewList[i].total = this.utilities.truncateToTwoDecimals(Number(price));  //.toFixed(2);
        }
        else {
          this.poItemsViewList[i].taxAmount = 0;
          this.poItemsViewList[i].total = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
          this.poItemsViewList[i].grandTotal = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
        }

        this.po.totalQty = Number(this.po.totalQty) + Number(this.poItemsViewList[i].quantity);

        priceTotal = priceTotal + Number(this.poItemsViewList[i].grandTotal);

      }

    }

    let p1 = this.utilities.truncateToTwoDecimals(Number(priceTotal)); //.toFixed(2);
    this.po.total = Number(p1) - this.po.discount;
    this.po.subTotal = p1;


  }
  /* ******************************************************* */
  discountChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let discountElem = <HTMLInputElement>(document.getElementById('discount_' + index));

    let discountNum = Number(discountElem.value);

    this.poItemsViewList[index].discount = discountNum;
    //this.poItems[index].discount = discountNum;

    this.calculateTotalPrice();
  }

  /* **************************************************************** */
  taxChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let taxElem = <HTMLInputElement>(document.getElementById('tax_' + index));

    let taxNum = Number(taxElem.value);


    this.poItemsViewList[index].tax = taxNum; //it is in percentage

    this.calculateTotalPrice();
  }

  /* *********************************************** */
  totalDiscountChange() {
    this.po.total = this.po.subTotal - this.po.discount;
  }

  /* *************************************************** */
  save() {
    if (this.poItemsViewList.length > 0) {
      //Get and set PurchaseOrder and POItems[]
      let po = new PurchaseOrder();
      //let poItems: POItems[]=[];

      //Convert Form to Request Object
      this.formToPO();

      let poRequest: PORequest = new PORequest();
      poRequest.po = this.po; //PO Master
      poRequest.poItems = this.poItemsViewList; //PO Items

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
                this.router.navigate(['purchaseorder']);
                //window.location.reload();
              }
            }
          }

        }

      );
    }
  }

  /* ***************************************************** */

  formToPO() {



    let loggedInUser = new AdminUser();
    loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    this.po.currency = this.selectedCurrency;
    //this.po.poStatus = 'OPEN';
    this.po.contactPerson = this.supplierContactPerson;
    //this.po.poDate = this.po.poDate;
    //this.po.poType = this.po.poType;
    //this.po.remarks = this.remarks;
    //this.po.subTotal = this.subTotal;
    //this.po.discount = this.discount;
    //po.tax = this.tax;
    //this.po.total = this.total;
    //this.po.poNumber = this.po.poNumber;
    //this.po.poRef = 
    this.po.updatedBy = loggedInUser.loginId;


  }
/* ***************************************************** */
  poList() {
    this.router.navigate(['/layout/purchase-order']);
  }

  /* ******************************************************* */
  qtyChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let qty = <HTMLInputElement>(document.getElementById('Qty_' + index));

    if (qty.value !== undefined) {
      if (Number(qty.value) < 0) {
        qty.value = '0';
        Swal.fire('Warning', 'Qty should be positive value', 'error');
      }
    }

    this.poItemsViewList[index].quantity = qty.value;
    //this.poItems[index].quantity = qty.value;

    this.calculateTotalPrice();
  }

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
                        <label>PO No: <strong>`+ this.po.poNumber + ` </strong></label>
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>Status: <strong> OPEN</strong></label>
                        
                    </div>
                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                        <label>PO Date: <strong>`+ this.po.poDate + `</strong></label>
                        
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

    let currencySign = '$';
    if (this.selectedCurrency === 'USD') {
      currencySign = '$';
    }
    else if (this.selectedCurrency === 'CAD') {
      currencySign = '$';
    }
    else if (this.selectedCurrency === 'PKR') {
      currencySign = 'Rs';
    }


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
    }//for loop for TR

    let tfootTag = ``;
    tfootTag = `                    </tbody>
                    <tfoot style="border: 1px solid;">
                        <tr class="mt-3 mb-3">
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>

                            <td style="border:none; text-align:right" colspan="2">SUBTOTAL: ` + currencySign + `</td>
                            <td >`+ (this.po.subTotal === undefined ? 0 : this.po.subTotal) + `</td>
                        </tr>
                        <tr class="mt-3 mb-3">
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none;text-align:right" colspan="2">Discount: ` + currencySign + `</td>
                            <td >`+ (this.po.discount === undefined ? 0 : this.po.discount) + `
                            </td>
                        </tr>
                        <tr class="mt-3 mb-3">
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none"></td>
                            <td style="border:none;text-align:right" colspan="2">Total Payment Due: ` + currencySign + `</td>
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
let rcvdProduct = new POItemsView();
        rcvdProduct.productId = this.product.productId;
        rcvdProduct.productName = this.product.productName;
        //rcvdProduct.productDetails = this.product.productDetails;
        rcvdProduct.quantity = this.product.quantity;
        rcvdProduct.unitPrice = this.product.unitPrice;
        rcvdProduct.tax = this.product.tax;
        rcvdProduct.poId = this.po.poId;
        rcvdProduct.grandTotal = 0;
        this.po.totalQty = Number(this.po.totalQty) + Number(this.product.quantity);

        rcvdProduct.discount = (this.product.discount === null ? 0 : this.product.discount);
        //rcvdProduct. .upc = this.upc;
        //rcvdProduct.receivedQty =
        this.poItemsViewList.push(rcvdProduct);

        //Now setup POitems
        //this.setPoItems(rcvdProduct);
        //reset upc input
        this.upc = '';
        let i = 0;
        this.calculateTotalPrice();

  }



  /* **************** LAST Section ******************* */
}
