import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { mynewdata, Supplier, ReceiveProductItems, ReceiveProduct, PurchaseOrder, ProductView, AdminUser, RcvRequest, ReceiveProductResponse, POItemsView, PoItems, ReceiveProductItemsView } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { ProductsService } from '../../shared/services/products.service';
import { ReceiveProductService } from '../../shared/services/receive-product.service';
import { SupplierService } from '../../shared/services/supplier.service';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { faFilePdf, faList, faPrint, faTrash, faPlusSquare, faRupeeSign, faDashboard, faRemove, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UtilitiesService } from '../../shared/utilities.service';
import { environment } from '../../../environments/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeComponent } from 'angularx-qrcode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import hr from '@angular/common/locales/hr';



@Component({
  selector: 'app-purchase-invoice',
  imports: [FormsModule, CommonModule, TableModule, QRCodeComponent, FontAwesomeModule],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './purchase-invoice.component.html',
  styleUrl: './purchase-invoice.component.scss'
})
export class PurchaseInvoiceComponent implements OnInit {

  invoiceUrl = `Hello TECHMACI`;
  appName = environment.appName;

  fileName = 'ExcelSheet.xlsx';
  faSave = faSave;
  faPrint = faPrint;
  faList = faList;
  faDollar = faDollar;
  faTrash = faTrash;
  faFilePdf = faFilePdf;


  poFlag = false;
  currency = environment.currency;

  purchaseOrder: PurchaseOrder = new PurchaseOrder();
  poItemsViewList: POItemsView[] = [];
  // UI / data lists
  suppliertList: Supplier[] = [];
  mySupplier: Supplier = new Supplier();
  selectedSupplierCode: any = ''; // holds supplierCode (as template uses supplierCode value)
  receiveItemList: ReceiveProductItemsView[] = [];
  receiveProduct: ReceiveProduct = new ReceiveProduct();

  // other fields
  poId: any;
  poNumber: any = '';
  rcvNumber: any;
  contactPerson: any;
  rcvStatus: any = "open";
  fromDate: any;
  rcvDate: any;
  ReceivePrintFlag = false;
  ReceiveFlag = true;
  mydata: string = '';
  showInvoiceFlag = false;

  constructor(
    private recieveService: ReceiveProductService,
    private supplierService: SupplierService,
    private router: Router,
    private productService: ProductsService,
    private cache: CacheService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private utilities: UtilitiesService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {


    let receiveId: number = Number(this.route.snapshot.paramMap.get('receiveId'));
    if (receiveId === null || receiveId === undefined || receiveId < 1) {
      this.showInvoiceFlag = false;
    }
    else {
      this.showInvoiceFlag = true;
    }


    this.rcvDate = this.datepipe.transform(new Date(), "yyyy-MM-dd HH:mm");

    // load supplier list
    this.supplierService.getSupplierList().subscribe((data: Supplier[]) => {
      this.suppliertList = data || [];
      if (this.suppliertList.length > 0) {
        this.selectedSupplierCode = this.suppliertList[0].supplierCode;
        this.mySupplier = this.suppliertList[0];
        this.receiveProduct.supplierId = this.mySupplier.supplierId;
      }
    }, err => {
      console.error('supplier load error', err);
    });



    this.recieveService.getRcvByRcvId(receiveId).subscribe((data: ReceiveProduct) => {
      this.receiveProduct = data;


      this.recieveService.getPOByPOId(this.receiveProduct.poId).subscribe((data: PurchaseOrder) => {
        this.purchaseOrder = data;
      });

      //CASE-1: RCV PRODUCT EDIT
      this.recieveService.getRcvItem(receiveId).subscribe((data: ReceiveProductItemsView[]) => {
        this.receiveItemList = data;

        this.poFlag = true;

        this.createQRInvoiceText();

      });
    });



  }

  /* *********************************************************************** */
  // convert form to receive object (pull summary fields)
  formToPO() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.receiveProduct.poId = this.poId;
    this.receiveProduct.rcvNumber = this.rcvNumber;
    this.receiveProduct.supplierId = this.mySupplier?.supplierId || this.receiveProduct.supplierId;
    this.receiveProduct.rcvStatus = 'OPEN';
    this.receiveProduct.contactPerson = this.contactPerson;
    this.receiveProduct.remarks = this.receiveProduct.remarks;
    this.receiveProduct.rcvDate = this.fromDate;
    this.receiveProduct.subTotal = Number(this.receiveProduct.subTotal || 0);
    this.receiveProduct.discount = Number(this.receiveProduct.discount || 0);
    this.receiveProduct.tax = Number(this.receiveProduct.tax || 0);
    this.receiveProduct.total = Number(this.receiveProduct.total || 0);
    this.receiveProduct.updatedBy = loggedInUser?.loginId;
    this.receiveProduct.userId = loggedInUser?.loginId;
  }

  /* *********************************************************************** */
  close() {
    this.router.navigate(['home']);
  }
  /* *********************************************************************** */
  clear() {
    // simpler reload
    location.reload();
  }
  /* *********************************************************************** */
  // recalc totals for all line items and summary
  recalculateSummary() {
    let subtotal = 0;
    for (let i = 0; i < this.receiveItemList.length; i++) {
      const it = this.receiveItemList[i];
      // convert numeric fields
      it.quantity = Number(it.quantity || 0);
      it.unitPrice = Number(it.unitPrice || 0);
      it.discount = Number(it.discount || 0);
      it.tax = Number(it.tax || 0);

      // base price
      const base = it.quantity * it.unitPrice;
      const afterDiscount = base - it.discount;
      const taxAmount = (afterDiscount * it.tax) / 100;
      it.total = Number((afterDiscount + taxAmount).toFixed(2));
      subtotal += Number(it.total);
    }
    this.receiveProduct.subTotal = Number(subtotal.toFixed(2));
    // apply global discount if any
    const globalDiscount = Number(this.receiveProduct.discount || 0);
    this.receiveProduct.total = Number((this.receiveProduct.subTotal - globalDiscount).toFixed(2));
    if (isNaN(this.receiveProduct.total)) this.receiveProduct.total = 0;
  }
  /* *********************************************************************** */
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

  /* *********************************************************************** */
  discountChange(index: number) {
    if (this.receiveItemList[index]) {
      this.receiveItemList[index].discount = Number(this.receiveItemList[index].discount || 0);
      this.recalculateSummary();
    }
  }
  /* *********************************************************************** */
  taxChange(index: number) {
    if (this.receiveItemList[index]) {
      this.receiveItemList[index].tax = Number(this.receiveItemList[index].tax || 0);
      this.recalculateSummary();
    }
  }
  /* *********************************************************************** */
  deleteItem(row: number) {
    if (!this.receiveItemList[row]) return;
    Swal.fire({
      title: `Are you sure to delete ${this.receiveItemList[row].receiveProductId || 'this item'} ?`,
      text: 'You can not un delete!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.isConfirmed || response.value) {
        // remove only that index
        this.receiveItemList.splice(row, 1);
        this.recalculateSummary();
        Swal.fire('Deleted', 'Item removed', 'success');
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Item is safe', 'error');
      }
    });
  }
  /* *********************************************************************** */
  changea(items: any) {
    this.mydata = 'ITEM';
  }
  /* *********************************************************************** */
  changeb(service: any) {
    this.mydata = 'SERVICE';
  }
  /* *********************************************************************** */
  totalDiscountChange() {
    // recalc final total after global discount changed
    this.receiveProduct.total = Number((Number(this.receiveProduct.subTotal || 0) - Number(this.receiveProduct.discount || 0)).toFixed(2));
  }
  /* *********************************************************************** */
  invoice(rec: any) {
    // template passes receiveProduct object
    let idToGo = rec && rec.receiveProductId ? rec.receiveProductId : (rec && rec.rcvNumber ? rec.rcvNumber : '');
    if (!idToGo) {
      // fallback: open invoice page without id or with 0
      this.router.navigate(['invoice', 0]);
    } else {
      this.router.navigate(['invoice', idToGo]);
    }
  }
  /* *********************************************************************** */
  printPreview() {
    this.ReceiveFlag = false;
    this.ReceivePrintFlag = true;
  }
  /* *********************************************************************** */
  pdfSave() {
    const DATA: any = document.getElementById('excel-table');
    if (!DATA) {
      Swal.fire('Error', 'Nothing to print', 'error');
      return;
    }
    html2canvas(DATA).then((canvas: any) => {
      const fileWidth = 208;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('receive-order.pdf');
    }).catch((err: any) => {
      console.error(err);
      Swal.fire('Error', 'Could not generate PDF', 'error');
    });
  }

  /* **************************************************************** */
  printRcpt() {

    let printWindow: any;

    const printContentObj = document.getElementById('invoiceArea');
    const printContent = printContentObj?.innerHTML;
    const originalContent = document.body.innerHTML;


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
        .d-md-none {
          display: none !important;
        }
         /* Page setup */
        @page {
          size: A4;
          margin: 12mm;
        }  
        .no-print { display: none; }
        .page-break {page-break-after: always;
			}

      table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          thead {border: 2px solid black;background-color:none;}
     </style>
     `;

    let bodyHtmlTag =
      `<title> Receive Invoice </title>
     </head>    
     <body  onload="window.print();window.close();">`;



    let footerHtml =
      `</body>
     </html>
       `;

    let finalHTMLTag = headHtmlTag + styleTag + bodyHtmlTag + printContent + footerHtml;
    printWindow.document.open();
    printWindow.document.write(finalHTMLTag);

    printWindow.document.close();
    //printWindow.focus();
    //printWindow.print();  






  }

  /* *********************************************************************** */
  closePrint() {
    this.ReceiveFlag = true;
    this.ReceivePrintFlag = false;
  }
  /* *********************************************************************** */
  exportexcel(): void {
    const element = document.getElementById('excel-table');
    if (!element) {
      Swal.fire('Error', 'No exportable element found', 'error');
      return;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }



  /* ******************************************************* */
  poSearchEnter(event: any) {
    const value = event.target.value.trim();
    if (event.keyCode === 13) {
      //Enter

      // if (value.length < 2) {

      //   return;
      // }
      // else{
      this.searchByPo();
      // }

    }


  }
  /* ******************************************************* */
  searchByPo() {
    if (this.poNumber === undefined) {
      return;
    }

    this.recieveService.getPOByPONumber(this.poNumber).subscribe((data: PurchaseOrder) => {
      this.purchaseOrder = data;


      if (this.purchaseOrder !== null || this.purchaseOrder !== undefined) {
        //First Check if this PO Number already have , receive_product_items Table, 
        // if not, then 1st time PO is in RCV. So get the data from Purchase_order, po_items table

        this.recieveService.getRcvByPOId(this.purchaseOrder.poId).subscribe((data: ReceiveProduct) => {
          this.receiveProduct = data;

          if (this.receiveProduct === null) {
            //CASE-2: RCV PRODUCT NOT FOUND, ONLY PO CREATED
            //Now get PO Items
            this.recieveService.getPoItem(this.purchaseOrder.poId).subscribe((data: POItemsView[]) => {
              this.poItemsViewList = data;

              //Convert purchaseOrder to receiveProduct
              //Convert poItemsViewList to receiveItemList
              this.receiveProduct = new ReceiveProduct();

              this.convertPOToRcv();
              this.convertPoItemsToRcvItems();

              this.showInvoiceFlag = true;
            });

          }
          else if (this.receiveProduct !== null || this.receiveProduct !== undefined) {
            //CASE-1: RCV PRODUCT EDIT
            this.recieveService.getRcvItem(this.receiveProduct.receiveProductId).subscribe((data: ReceiveProductItemsView[]) => {
              this.receiveItemList = data;

              this.showInvoiceFlag = true;
            });

          }



          //this.poFlag = true;
        });





      }

    });
  }
  /* ********************************************* */
  convertPOToRcv() {
    //Source : this.purchaseOrder
    //Destination: this.receiveProduct

    this.receiveProduct.receiveProductId = null;
    this.receiveProduct.poId = this.purchaseOrder.poId;
    this.receiveProduct.rcvNumber = this.purchaseOrder.poNumber;
    this.receiveProduct.supplierId = this.purchaseOrder.supplierId;
    this.receiveProduct.contactPerson = this.purchaseOrder.contactPerson;
    this.receiveProduct.rcvStatus = this.purchaseOrder.poStatus;
    this.receiveProduct.currency = this.purchaseOrder.currency;
    this.receiveProduct.rcvDate = this.purchaseOrder.orderDate;
    this.receiveProduct.rcvType = this.purchaseOrder.poType;
    this.receiveProduct.remarks = this.purchaseOrder.remarks;
    this.receiveProduct.subTotal = this.purchaseOrder.subTotal;
    this.receiveProduct.discount = this.purchaseOrder.discount;
    this.receiveProduct.tax = this.purchaseOrder.tax;
    this.receiveProduct.total = this.purchaseOrder.total;
    this.receiveProduct.updatedBy = this.purchaseOrder.updatedBy;
    this.receiveProduct.updatedDate = this.purchaseOrder.updatedDate;
    this.receiveProduct.productId = this.purchaseOrder.productId;
    this.receiveProduct.userId = this.purchaseOrder.userId;
    this.receiveProduct.quantity = this.purchaseOrder.quantity;
    this.receiveProduct.unitPrice = this.purchaseOrder.unitPrice;
    this.receiveProduct.rcvDate = this.rcvDate;

  }




  /* ********************************************* */
  convertPoItemsToRcvItems() {
    //Source:poItemsViewList
    //Destination: receiveItemList


    for (let i = 0; i < this.poItemsViewList.length; i++) {
      let rcvItem: ReceiveProductItemsView = new ReceiveProductItemsView();

      rcvItem.receiveItemId = null;
      rcvItem.receiveProductId = null;
      //rcvItem.poNumber = this.purchaseOrder.poNumber;
      rcvItem.productId = this.poItemsViewList[i].productId;
      rcvItem.productName = this.poItemsViewList[i].productName;
      //rcvItem.productDescription = this.poItemsViewList[i].productName;
      rcvItem.quantity = this.poItemsViewList[i].quantity;
      rcvItem.unitPrice = this.poItemsViewList[i].unitPrice;
      rcvItem.discount = this.poItemsViewList[i].discount;
      rcvItem.tax = this.poItemsViewList[i].tax;
      rcvItem.total = this.poItemsViewList[i].total;
      //rcvItem.warehouseId = this.poItemsViewList[i].warehousId;
      //rcvItem.warehouseBin: any;
      //rcvItem.location: any;
      rcvItem.updatedBy = this.poItemsViewList[i].updatedBy;
      rcvItem.updatedDate = this.poItemsViewList[i].updatedDate;
      //rcvItem.wholesalePrice = this.poItemsViewList[i];

      this.receiveItemList.push(rcvItem);
    }

  }



  /* ********************************************* */


  /* ********************************************* */

  /* *********************************************************************** */
  format(val: number) {
    return Number(val.toFixed(2));
  }

  /* *********************************************************************** */
  save() {
    if (!this.receiveItemList || this.receiveItemList.length === 0) {
      Swal.fire('Error', 'No items to save', 'error');
      return;
    }

    //this.formToPO();
    const rcRequest: any = {
      rcvdProduct: this.receiveProduct,
      rcvProductItems: this.receiveItemList
    };

    this.recieveService.save(rcRequest.rcvdProduct, rcRequest.rcvProductItems).subscribe((resp: any) => {
      if (!resp || !resp.rcvdProduct) {
        Swal.fire('Error', 'Error in saving Receive Order', 'error');
      } else {
        const saved = resp.rcvdProduct;
        Swal.fire('Submit', `You have saved Receive Order ${saved.poId || saved.rcvNumber || ''} Successfully!`, 'success');
        // optionally navigate or update UI
        this.router.navigate(['/layout/purchase-order']);
      }
    }, err => {
      console.error(err);
      Swal.fire('Error', 'Unable to save. See console.', 'error');
    });
  }

  /* ********************************************************************* */
  calculateTotalPrice() {
    let priceTotal: any = 0;

    let mquantity: any = 0
    this.receiveProduct.quantity = 0;//reset
    for (let i = 0; i < this.receiveItemList.length; i++) {

      let unitPrice = this.receiveItemList[i].unitPrice;

      if (unitPrice != undefined) {

        let price = (unitPrice * this.receiveItemList[i].quantity);
        //this.poItems[i].unitPrice = unitPrice;
        let discount: any = 0;
        if (this.receiveItemList[i].discount !== undefined) {
          discount = this.receiveItemList[i].discount;
        }
        else {
          discount = 0;
        }

        price = price - discount;
        if (this.receiveItemList[i].tax !== undefined) {
          //this.poItems[i].tax = this.receiveItemList[i].tax;
          let priceTax = (price * this.receiveItemList[i].tax) / 100;
          this.receiveItemList[i].tax = priceTax;
          this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price + priceTax)); //.toFixed(2);
          this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price));  //.toFixed(2);
        }
        else {
          this.receiveItemList[i].tax = 0;
          this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
          this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
        }

        this.receiveProduct.quantity = Number(this.receiveProduct.quantity) + Number(this.receiveItemList[i].quantity);

        priceTotal = priceTotal + Number(this.receiveItemList[i].total);

      }

    }

    let p1 = this.utilities.truncateToTwoDecimals(Number(priceTotal)); //.toFixed(2);
    this.receiveProduct.total = Number(p1) - this.receiveProduct.discount;
    this.receiveProduct.subTotal = p1;


  }

  navigatePoList() {
    this.router.navigate(['/layout/purchase-order']);
  }







  /* ************************************************************** */
  exportPDF() {
    const element = document.getElementById('invoiceArea')!;

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save(`GRN_${this.purchaseOrder.poNumber}.pdf`);
    });
  }


  printReceipt() {
    const printContents = document.getElementById('thermalReceipt')!.innerHTML;
    const win = window.open('', '', 'width=300,height=600');
    win!.document.write(printContents);
    win!.document.close();
    win!.print();
  }

  /* ******************************************************* */
  thermalTag = false;

  printThermal() {
    this.thermalTag = true;

    let popupWin;

    popupWin = window.open('', '_blank');
    let myFlag = true;
    if (popupWin != null || popupWin != undefined) {


      let styleTag = `
     <style>

.recipt_container
{
    width: 100% !important;
    max-width: 100mm;
    font-family: 'Poppins', sans-serif;
}

/* .tax
{
    display: none;
} */

.header
{
    text-align: center;
}
.header img
{
    width: 75%;
}

.float
{
    float: left;
}
.clear
{
    float: left;
    clear: both;
}

.company_details p
{
    font-size: 8pt;
    text-transform: uppercase;
    font-weight: 400;
    line-height: 11px;
}
.inv_details table
{
    font-size: 7pt;
    margin-left: auto;
    margin-right: auto;
    width: 95% !important;
    text-align: left;

}
.inv_details table th
{
    width: 50%;

}
.items table
{
    width: 98%;
    font-size: 7pt;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;


}
.items table thead tr, .items table tfoot tr
{
    border-top: 1pt solid black;
    border-bottom: 1pt solid black;
}
.items table tbody tr
{
    border-top: 0.9pt dotted black;
    border-bottom: 0.9pt dotted black;
}
.items table th:first-child{
   text-align: left;
}
.items table td:first-child{
    text-align: left;
}

.items table th:last-child{
    text-align: right;
 }
 .items table td:last-child{
     text-align: right;
 }

.totals table
 {
    width: 98%;
    font-size: 8pt;
    text-align: right;
    margin-right: 0px;
 }
 .totals table td:last-child
 {
     max-width: 30%;
 }
 .fbr
 {
     text-align: center;
 }
 .fbr_logo_0
 {
     width: 30mm;
     text-align: center;
 }
 .usin
 {
    width: 80%;
    max-height: 100px;
}

.fbr p
{
    font-size: 9pt;
    margin-top: 3px;
    margin-bottom: 3px;
    padding-left: 1%;
    padding-right: 1%;
}

.terms
{
    font-size: 8pt;
    text-align: center;
    padding-left: 1%;
    padding-right: 1%;
}

.copy
{
    font-size: 6pt;
    text-align: center;
}

.items table .inv_of td:last-child{
    text-align: center;
}

.logo
{
    margin-top: 5%;
    max-width: 100%;
    max-height: 100px;
}

.contact
{
    font-size: 7pt;
    text-align: center;
    padding-left: 1%;
    padding-right: 1%;
}

@media print {

    .recipt_container {
        page-break-after: always;

    }
        
    .page-break {
       page-break-before: always;
      }
        

}
    </style>`;


      let startHtmlTag = `
      <html> 
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> 
    <title>Invoice Receipt</title>
    </head>    
    <body  onload="window.print();window.close();">
    <div class="recipt_container">  
    `;


      let lastHtml = `</div></body></html>`;

      let mainHtml = this.createQRInvoice();

      let finalHtmlTag = startHtmlTag + mainHtml + mainHtml;
      popupWin.document.write(finalHtmlTag);
      popupWin.document.close();
      this.thermalTag = false;

    }




  }
  /* ********************************************************* */

  createQRInvoice() {

    let poNumber = this.purchaseOrder.poNumber;
    const formattedDate = this.datePipe.transform(
      this.receiveProduct.rcvDate,
      'yyyy-MM-dd HH:mm'
    );

    let invoiceTop = `
  <div class="receipt" id="thermalReceipt">

    <div class="text-center">
      <h5 class="mb-0"> ${this.appName}  </h5>
      <small>Goods Receiving Invoice</small>
    </div>
    <hr>
    <div>
      <b>PO:</b> ${poNumber} <br>
      <b>Date:</b> ${formattedDate}
    </div>
    <p>---------------------------------</p>
  `
      ;

    let invoiceItem = '';
    this.receiveItemList.forEach((item, index) => {

      invoiceItem += `

      <div >
        ${item.productName}<br>
        ${item.quantity} x ${this.decimalFixed(item.unitPrice)} <br>
        <span class="float-end">
          ${this.currency}:  ${this.decimalFixed(item.total)}
        </span>
      </div>
      <p>-------------------------</p>
    `
        ;

    });

    let lastHtml = `
        
        <p>---------------------------------</p>
        <div>
          Subtotal
          <span class="float-end">${this.currency}: ${this.decimalFixed(this.receiveProduct.subTotal)} </span>
        </div>

        <div>
          Discount
          <span class="float-end">${this.currency}: ${this.decimalFixed(this.receiveProduct.discount)}</span>
        </div>
        <div>
          Tax
          <span class="float-end">${this.currency}: ${this.decimalFixed(this.receiveProduct.tax)} </span>
        </div>

        <div class="fw-bold">
          TOTAL
          <span class="float-end">${this.currency}: ${this.decimalFixed(this.receiveProduct.total)}</span>
        </div>
        <p>---------------------------------</p>
        

        <div class="text-center">
          Thank you
        </div>

      </div>
      `;

    let qrCode = invoiceTop + invoiceItem + lastHtml;
    //this.invoiceUrl = qrCode;
    return qrCode;

  }
  /* ***************************************************** */
  createQRInvoiceText() {
    let poNumber = this.purchaseOrder.poNumber;
    const formattedDate = this.datePipe.transform(
      this.receiveProduct.rcvDate,
      'yyyy-MM-dd HH:mm'
    );

    let invoiceTop =
      `    ${this.appName}  
    Goods Receiving Invoice
    -------------------------------
    PO: ${this.purchaseOrder.poNumber} 
    Date: ${formattedDate} 
    -------------------------------

  `
      ;

    this.receiveProduct.quantity = this.receiveProduct.quantity | 0;

    let invoiceItem = '';
    this.receiveItemList.forEach((item, index) => {

      this.receiveProduct.quantity += item.quantity;

      invoiceItem +=
        `  ${item.productName} 
        ${item.quantity} x ${this.decimalFixed(item.unitPrice)} 
        ${this.currency}:  ${this.decimalFixed(item.total)} 
    `
        ;
    });



    let lastHtml =
      `-------------------------------
    Subtotal:${this.currency}: ${this.decimalFixed(this.receiveProduct.subTotal)} 
    Discount:${this.currency}: ${this.decimalFixed(this.receiveProduct.discount)} 
    Tax:${this.currency}: ${this.decimalFixed(this.receiveProduct.tax)} 
    TOTAL:${this.currency}: ${this.decimalFixed(this.receiveProduct.total)}
    -------------------------------
    Thank you

`;

    let qrCode = invoiceTop + invoiceItem + lastHtml;
    this.invoiceUrl = qrCode;

  }



  /* ********************************************** */
  decimalFixed(amount: any) {
    const formattedAmount =
      this.decimalPipe.transform(amount, '1.2-2');

    return formattedAmount;

  }

}
