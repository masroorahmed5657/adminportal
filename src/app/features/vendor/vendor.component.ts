import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier, Invoice, PurchaseOrder, CombinedModel } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { InvoiceService } from '../../shared/services/invoice.service';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { SupplierService } from '../../shared/services/supplier.service';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FooterComponent } from "../../layouts/footer/footer.component";
import { Header2Component } from "../header2/header2.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor',
  imports: [CommonModule,FormsModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent implements OnInit {
  startDate: any = null;
  endDate: any = null;
  fileName = 'ExcelSheet.xlsx';
  supplierList: Supplier[] = [];
  supplierListNew: Supplier[] = [];
  invoicePaymentsList: Invoice[] = [];
  invoicePaymentsListNew: Invoice[] = [];
  purchaseOrdersList: PurchaseOrder[] = [];
  purchaseOrdersListNew: PurchaseOrder[] = [];
  combinedArray: CombinedModel[] = [];

  totalPurchaseReturns: number = 0;
  totalPurchases: number = 0;
  totalInvoices: number = 0;
  netIncome: number = 0;


  constructor(
    private cache: CacheService,
    private router: Router,
    private poService: PurchaseOrderService,
    private supplierService: SupplierService,
    private invoiceService: InvoiceService,) { }



  ngOnInit(): void {



  }


  generateLedgerReport() {
    if (this.startDate && this.endDate) {
      this.poService.getAll().subscribe((data: PurchaseOrder[]) => {
        if (data !== undefined) {
          this.purchaseOrdersList = data;


          if (this.purchaseOrdersList !== null || this.purchaseOrdersList != undefined) {
            for (let i = 0; i < this.purchaseOrdersList.length; i++) {
              this.purchaseOrdersListNew.push(this.purchaseOrdersList[i])
            }


            this.supplierService.getSupplierList().subscribe((data: Supplier[]) => {
              if (data !== undefined) {
                this.supplierList = data;


                if (this.supplierList !== null || this.supplierList != undefined) {
                  for (let i = 0; i < this.supplierList.length; i++) {
                    this.supplierListNew.push(this.supplierList[i])
                  }


                  this.invoiceService.invoiceFindAll().subscribe((data: Invoice[]) => {
                    if (data !== undefined) {
                      this.invoicePaymentsList = data;


                      if (this.invoicePaymentsList !== null || this.invoicePaymentsList != undefined) {
                        for (let i = 0; i < this.invoicePaymentsList.length; i++) {
                          this.invoicePaymentsListNew.push(this.invoicePaymentsList[i])
                        }
                        this.calculateTotals();


                      }
                    }
                  });


                }
              }
            });


          }
        }

      });
    }
  }


  exportToExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Supplier Details');

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
      PDF.save('Supplier Details.pdf');
    });
  }


  combineArrays(): void {
    this.combinedArray = [];

    for (let i = 0; i < Math.max(this.purchaseOrdersList.length, this.invoicePaymentsList.length, this.supplierList.length); i++) {
      const combinedModel: CombinedModel = {
        purchaseOrder: this.purchaseOrdersList[i] || null,
        invoice: this.invoicePaymentsList[i] || null,
        supplier: this.supplierList[i] || null,
      };

      this.combinedArray.push(combinedModel);
    }
  }

  calculateTotals(): void {

    // Get purchase data
    this.totalPurchases = this.purchaseOrdersListNew.reduce((sum, purchase) => sum + (purchase.total || 0), 0);
    this.totalInvoices = this.purchaseOrdersListNew.reduce((sum, purchase) => sum + (purchase.total || 0), 0);

    // Calculate net income
    this.netIncome = Math.round(this.totalInvoices - (this.totalPurchases - this.totalPurchaseReturns));


  }


}
