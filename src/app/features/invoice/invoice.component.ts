import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier, PurchaseOrder, Invoice } from '../../shared/models/model-classes.model';
import { InvoiceService } from '../../shared/services/invoice.service';
import { SupplierService } from '../../shared/services/supplier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule,FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {


  selectedSupplier: any;
  suppliertList: Supplier[] = [];
  mySupplier: Supplier = new Supplier();
  po: PurchaseOrder = new PurchaseOrder();
  invoiceList: Invoice[] = [];
  invoiceData: any = {};



  constructor(
    private supplierService: SupplierService,
    private invoiceService: InvoiceService,
    private router: Router
  ) { }

  ngOnInit(): void {


    //get the data supplier
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
    /************* */
  }


  /**************** */
  //select the supplier data with dropdwon

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
  /* ************************************************************** */

  /************************************* */
  search() {
    this.invoiceService.invoiceFindAll().subscribe((data: Invoice[]) => {
      this.invoiceList = data;


    });

  }

  /**************************************** */

  addRow() {
    this.invoiceData.items.push({
      item: '',
      description: '',
      rate: 0,
      quantity: 0,
      Price: 0,
    });
  }

  removeRow(_t14: number) {
    this.invoiceData.items.slice({
      item: '',
      description: '',
      rate: 0,
      quantity: 0,
      Price: 0,
    });
  }

  save() {
    throw new Error('Method not implemented.');
  }
  /* ************************************************************* */
  //close code function start
  close() {
    this.router.navigate(['home']);
  }//clear code function end

  /* ************************************************************ */
  list() {
    throw new Error('Method not implemented.');
  }



}
