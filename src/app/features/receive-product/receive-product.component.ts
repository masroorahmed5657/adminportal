import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { mynewdata, Supplier, ReceiveProductItems, ReceiveProduct, PurchaseOrder, ProductView, AdminUser, RcvRequest, ReceiveProductResponse, POItemsView, PoItems, ReceiveProductItemsView } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { ProductsService } from '../../shared/services/products.service';
import { ReceiveProductService } from '../../shared/services/receive-product.service';
import { SupplierService } from '../../shared/services/supplier.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from "sweetalert2";
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { faList, faPrint, faTrash, faPlusSquare, faRupeeSign, faDashboard, faRemove, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UtilitiesService } from '../../shared/utilities.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-receive-product',
  imports: [FormsModule, CommonModule, TableModule],
  providers: [DatePipe],
  templateUrl: './receive-product.component.html',
  styleUrl: './receive-product.component.scss'
})

export class ReceiveProductComponent implements OnInit {
  fileName = 'ExcelSheet.xlsx';
  faSave = faSave;
  faPrint = faPrint;
  faList = faList;
  faDollar = faDollar;
  faTrash = faTrash;

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

  constructor(
    private recieveService: ReceiveProductService,
    private supplierService: SupplierService,
    private router: Router,
    private productService: ProductsService,
    private cache: CacheService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private utilities: UtilitiesService
  ) { }

  ngOnInit(): void {

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
    this.receiveProduct.quantity=0;
    for (let i = 0; i < this.receiveItemList.length; i++) {
      const it = this.receiveItemList[i];
      // convert numeric fields
      it.quantity = Number(it.quantity || 0);
      it.unitPrice = Number(it.unitPrice || 0);
      it.discount = Number(it.discount || 0);
      it.tax = Number(it.tax || 0);

      this.receiveProduct.quantity+=it.quantity;

      // base price
      const base = it.quantity * it.unitPrice;
      const afterDiscount = base - it.discount;
      const taxAmount = (afterDiscount * it.tax) / 100;
      it.total = Number((afterDiscount + taxAmount).toFixed(2));
      subtotal += Number(it.total);

      this.receiveItemList[i].amount = this.receiveItemList[i].quantity * this.receiveItemList[i].unitPrice;

    }
    this.receiveProduct.subTotal = Number(subtotal.toFixed(2));
    // apply global discount if any
    const globalDiscount = Number(this.receiveProduct.discount || 0);
    this.receiveProduct.total = Number((this.receiveProduct.subTotal - globalDiscount).toFixed(2));
    if (isNaN(this.receiveProduct.total)) this.receiveProduct.total = 0;
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
      this.router.navigate(['/layout/purchase-invoice', 0]);
    } else {
      this.router.navigate(['/layout/purchase-invoice', idToGo]);
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

    //Reset first
    this.receiveItemList.length=0;

    this.recieveService.getPOByPONumber(this.poNumber).subscribe((data: PurchaseOrder) => {
      this.purchaseOrder = data;


      if (this.purchaseOrder !== null || this.purchaseOrder !== undefined) {
        //First Check if this PO Number already have , receive_product_items Table, 
        // if not, then 1st time PO is in RCV. So get the data from Purchase_order, po_items table

        this.recieveService.getRcvByPOId(this.purchaseOrder.poId).subscribe((data: ReceiveProduct) => {
          this.receiveProduct = data;

          if (this.receiveProduct === null){
            //CASE-2: RCV PRODUCT NOT FOUND, ONLY PO CREATED
            //Now get PO Items
            this.recieveService.getPoItem(this.purchaseOrder.poId).subscribe((data: POItemsView[]) => {
              this.poItemsViewList = data;

              //Convert purchaseOrder to receiveProduct
              //Convert poItemsViewList to receiveItemList
              this.receiveProduct = new ReceiveProduct();

              this.convertPOToRcv();
              this.convertPoItemsToRcvItems();

              this.poFlag = true;
              this.recalculateSummary();
            });

          }
          else if (this.receiveProduct !== null || this.receiveProduct !== undefined) {
            //CASE-1: RCV PRODUCT EDIT
            this.recieveService.getRcvItem(this.receiveProduct.receiveProductId).subscribe((data: ReceiveProductItemsView[]) => {
              this.receiveItemList = data;

              this.poFlag = true;
              this.recalculateSummary();
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
      rcvItem.upc = this.poItemsViewList[i].upc;
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
      rcvItem.amount = this.poItemsViewList[i].unitPrice * this.poItemsViewList[i].quantity;

      this.receiveItemList.push(rcvItem);
    }

  }


  /* ********************************************* */
  // chkNumber(event: Event, row: number) {

  chkNumber(value: number, row: number) {

    //const value = (event.target as HTMLInputElement).value;

    if (value===null){
      return; //do nothing for backspace
    }

    if (value < 1) {
          //0 or below not allowed
          Swal.fire('WARNING', '0 or negative Qty is not allowed', 'warning');
          return;
        }
     else{
      this.poItemsViewList[row].quantity = value;
     //this.poItems[index].quantity = qty.value;

     this.recalculateSummary();
        //this.calculateTotalPrice();
     }   


    // let colName = 'Qty_' + row;
    // let qtyInput = <HTMLInputElement>document.getElementById(colName);
    // let val = qtyInput.value;

    // if (qtyInput != null || qtyInput != undefined) {
    //   let len = qtyInput.value.length;

    //   let qty = Number(val);
    //   if (qty < 1) {
    //     //0 or below not allowed
    //     Swal.fire('WARNING', '0 or negative Qty is not allowed', 'warning');
    //     return;

    //   }
    // }

  }//chkNumber
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

  }//chkPrice

  /* ******************************************************* */
  priceChange(index: number) {


    //let qty = this.cartForm.get('qty')?.value;

    let price = <HTMLInputElement>(document.getElementById('price_' + index));

    let priceNum = Number(price.value);

    this.poItemsViewList[index].unitPrice = priceNum;

    this.calculateTotalPrice();
  }
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

    this.receiveProduct.rcvStatus='RECEIVED';

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

        this.receiveItemList[i].amount = this.receiveItemList[i].quantity * this.receiveItemList[i].unitPrice;

        price = price - discount;
        if (this.receiveItemList[i].tax !== undefined) {
          //this.poItems[i].tax = this.receiveItemList[i].tax;
          let priceTax = (price * this.receiveItemList[i].tax) / 100;
          this.receiveItemList[i].tax = priceTax;
          this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price + priceTax)); //.toFixed(2);
          //this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price));  //.toFixed(2);
        }
        else {
          this.receiveItemList[i].tax = 0;
          this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
          //this.receiveItemList[i].total = this.utilities.truncateToTwoDecimals(Number(price)); //.toFixed(2);
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


}
