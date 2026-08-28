import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OrdersCustomerWrapper, Orders, Customer, OrdersItems, OrdersItemsView, Country, StateProvince, ProductView, EzpzTax, PriceSummary } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CustomerService } from '../../shared/services/customer.service';
import { OrderService } from '../../shared/services/order.service';
import { ProductsService } from '../../shared/services/products.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule, DatePipe } from '@angular/common';
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-orderdetail',
  imports: [DatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './orderdetail.component.html',
  styleUrl: './orderdetail.component.scss'
})

export class OrderdetailComponent implements OnInit {

  faClipboardList = faClipboardList

  projectName = environment.appName;
  orderList: OrdersCustomerWrapper[] | any = [];
  orders: Orders = new Orders();
  customer: Customer = new Customer();
  ordersItems: OrdersItems = new OrdersItems();
  ordersItemsList: OrdersItemsView[] = [];
  ordersItemsViewList: OrdersItems[] = [];
  countryList: Country[] = [];
  provinceList: StateProvince[] = [];
  productList: ProductView[] = [];

  //cache: any;

  total: any = 0;
  quantity = 0;
  price: any;
  selectedDepartment: any;
  displayedit: any = 0
  today: Date = new Date();
  ezpzTaxList: EzpzTax[] = [];

  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal: 0
  };

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private order: OrderService,
    private cache: CacheService,
    private productService: ProductsService,
    private orderService: OrderService,
  ) { }


  ngOnInit(): void {
    let mquantity: any = 0
    //this.route.queryParams.subscribe(params => {
    //this.orders=JSON.parse(params['orders']);
    //this.customer=JSON.parse(params['customer']);
    //this.ordersItemsList=JSON.parse(params['items']);

    this.orders = (this.cache.getList('orders'));
    this.ordersItemsList = this.cache.getList('ordersItem');
    this.customer = (this.cache.getList('customer'));
    this.selectedDepartment = this.cache.get('selectedDepartment');

    console.log(this.customer.address, "customer");

    // Guard against a hardcoded/zeroed order object (e.g. coming from the
    // kitchen board, which doesn't track tax/shipping) instead of trusting it blindly.
    this.orders.tax = Number(this.orders?.tax) || 0;
    this.orders.shippingHandling = Number(this.orders?.shippingHandling) || 0;

    this.getProductImage();
    this.recomputeTotals();

    this.countryList = this.cache.getList('countryList');
    if (!this.countryList) {
      this.customerService.getCountryList().subscribe(data => {
        this.countryList = data;
        console.log(this.countryList);

        if (this.countryList !== undefined) {
          this.cache.setList('countryList', this.countryList);
        }
      });
    }
    this.provinceList = this.cache.getList('provinceList');
    if (!this.provinceList) {
      this.customerService.getProvinceList().subscribe(data => {
        this.provinceList = data;
        if (this.provinceList !== undefined) {
          this.cache.setList('provinceList', this.provinceList);
        }
      });
    }


  }

  getTax1() {
    if (this.ezpzTaxList.length > 0) {
      return this.ezpzTaxList[0].tax;
    }
  }

  /* **************************************************** */
  getImage(productId: any) {



  }



  /* **************************************************** */
  //Component
  nameChanged(event: any) {
    //console.log("modelchanged " + event);
    this.quantity = event

    return event;

  }

  updatecart(event: any) {
    this.total = 0; // total reset
    let updatePrice = 0;

    this.ordersItemsList?.forEach((item: any) => {
      // her product ka total nikalo
      let itemTotal = item.quantity * item.unitPrice;

      // grand total add karo
      this.total += itemTotal;
    });

    // total ko 2 decimal places tak rakho
    this.total = Number(this.total.toFixed(2));

    // agar tumhe sirf unitPrice ka sum chahiye
    this.ordersItemsList?.forEach((item: any) => {
      updatePrice += item.unitPrice;
    });

    this.price = updatePrice;
  }


  showedit() {
    this.displayedit = 1

  }

  /* *********************************************************************** */
  afour: any = false;
  thermale: any = false;
  one: any = true;


  print() {
    this.one = false;
    window.print();
  }

  inVoie() {
    this.afour = true;
    this.thermale = false;

  }

  thermalPrint() {
    this.thermale = true;
    this.afour = false;
    window.print();
  }

  backToList() {
    this.cache.setList('orders', null);
    this.cache.setList('ordersItem', null);
    this.cache.setList('customer', null);
    this.router.navigate(["/layout/orders"]);
  }


printThermal(order: any, customer: any, items: any): void {
  let popupWin = window.open('', '_blank');
  if (popupWin != null || popupWin != undefined) {
    popupWin.document.open();

    let myHead = `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EZPZFashion Receipt</title>
      </head>
    `;

    let myHtml = `<html>` + myHead;

    let myBody = `
      <body onload="window.print();window.close();" 
            style="font-family: Arial, sans-serif; font-size: 12px;">

        <div style="width: 300px; margin: auto;">  <!-- Fixed receipt width -->

          <!-- Header -->
          <div style="text-align: center; border-bottom: 1px solid black; padding-bottom: 5px;">
            <h2 style="margin:0;">EZPZFashion</h2>
            <p style="margin:0; font-size: 11px;">123 Fashion Street, New York, NY</p>
            <p style="margin:0; font-size: 11px;">Phone: +1-555-1234 | www.ezpzfashion.com</p>
          </div>

          <!-- Customer + Order Info -->
          <div style="margin-top: 8px; border-bottom: 1px dashed black; padding-bottom: 5px;">
            <p style="margin:0;"><b>Customer:</b> ${customer?.firstName} ${customer?.lastName}</p>
            <p style="margin:0;"><b>Email:</b> ${customer?.email}</p>
            <p style="margin:0;"><b>Phone:</b> ${customer?.phone1}</p>
            <p style="margin:0;"><b>Date:</b> ${new Date(order?.createDate).toLocaleDateString()}</p>
            <p style="margin:0;"><b>Order#:</b> ${order?.orderNum ?? order?.orderId}</p>
          </div>

          <!-- Items Table -->
          <table style="width:100%; margin-top: 5px; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="border-bottom: 1px solid black;">
                <th style="text-align:left;">Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Items rows
    let myItems = ``;
    for (let i = 0; i < items.length; i++) {
      myItems += `
        <tr>
          <td>${items[i].productName}</td>
          <td style="text-align:center;">${items[i].quantity}</td>
          <td style="text-align:right;">$${items[i].unitPrice.toFixed(2)}</td>
        </tr>`;
    }

    // Totals
    let myTotal = this.total;
    let myTax = this.orders.tax.toFixed(2);
    let myShipping = this.orders.shippingHandling.toFixed(2);
    let myGrandTotal = this.getTotalPrice(this.orders.grandTotal);

    let myBottom = `
            </tbody>
          </table>

          <!-- Totals -->
          <div style="margin-top: 8px; border-top: 1px solid black; padding-top: 5px;">
            <p style="margin:0; text-align:right;">Subtotal: $${myTotal}</p>
            <p style="margin:0; text-align:right;">Shipping: $${myShipping}</p>
            <p style="margin:0; text-align:right;">Tax: $${myTax}</p>
            <p style="margin:0; font-weight:bold; text-align:right;">Total: $${myGrandTotal}</p>
          </div>

          <!-- Footer -->
          <div style="margin-top: 10px; text-align: center; border-top: 1px dashed black; padding-top: 5px;">
            <p style="margin:0;">Thanks for shopping with us!</p>
            <p style="margin:0; font-size: 10px;">No refund without receipt</p>
          </div>
        </div> <!-- /receipt-container -->
      </body>
      </html>
    `;

    let finalHtml = myHtml + myBody + myItems + myBottom;
    popupWin.document.write(finalHtml);
  }
}



  getCss(): string {

    let myCss = `
  {
    font-size: 3px;
    font-family: 'monospace sans-serif';
}

td,
th,
tr,
table {
    border-top: 1px solid black;
    border-collapse: collapse;
    width: 100%;
    font-size:3px !important;
}

td.description,
th.description {
    width: 75px;
    max-width: 75px;
}

td.quantity,
th.quantity {
    width: 40px;
    max-width: 40px;
    word-break: break-all;
}

td.price,
th.price {
    width: 40px;
    max-width: 40px;
    word-break: break-all;
}

.centered {
    text-align: center;
    align-content: center;
}
.leftAlign {
  text-align: left;
  align-content: left;
}

.title {
  text-align: left;
  align-content: left;
  font-size: 4px;
  font-weight: bold;
  font-family: 'monospace sans-serif';
}
.ticket {
  width: 100%;
  font-weight: bold;
}
.order{
  font-size: x-large;
}
img {
    max-width: inherit;
    width: inherit;
}

@media print {
    .hidden-print,
    .hidden-print * {
        display: none !important;
    }
}`;


    return myCss;
  }

  /* ******************************************* */
  getTotalPrice(totalPrice: any) {

    return Number(totalPrice).toFixed(2);

  }

  /* ******************************************* */
  // Single source of truth for SubTotal / Total — called on load, and again
  // once getProductImage() backfills any missing per-item price, so the UI
  // never shows a stale $0.00 amount.
  recomputeTotals() {
    let subtotal = 0;
    this.ordersItemsList?.forEach((item: any) => {
      subtotal += (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    });

    this.total = Number(subtotal.toFixed(2));

    const tax = Number(this.orders?.tax) || 0;
    const shipping = Number(this.orders?.shippingHandling) || 0;

    this.orders.tax = tax;
    this.orders.shippingHandling = shipping;
    this.orders.grandTotal = Number((subtotal + tax + shipping).toFixed(2));
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

  /* ************************************************* */
  getProductImage() {

    for (let i = 0; i < this.ordersItemsList.length; i++) {
      let productData: ProductView = new ProductView();

      let productId = this.ordersItemsList[i].productId;
      this.productService.getProductsById(productId).subscribe((result: any) => {

        productData = result; //one record
        this.ordersItemsList[i].imageMimeType = productData.imageMimeType;
        this.ordersItemsList[i].productImage = productData.productImage;
        this.ordersItemsList[i].sku = productData.sku;

        // The kitchen ticket payload doesn't carry a real price (it's a
        // cooking ticket, not a receipt), so backfill it here from the
        // actual product record instead of leaving it at 0.
        //
        // FIX (2026-08-19): POS's own price logic — see getPrice() in
        // pos-cards.component.ts — always prefers salePrice over unitPrice
        // when a sale price exists:
        //   price = product.salePrice ? product.salePrice : product.unitPrice
        // This backfill was checking unitPrice FIRST and never looked at
        // salePrice at all, so any item sold at a discount (e.g. sold for
        // $3900 via salePrice, while catalog unitPrice is $4200) would show
        // the full undiscounted catalog price here instead of what was
        // actually charged. salePrice is now checked first to match POS.
        if (!this.ordersItemsList[i].unitPrice) {
          this.ordersItemsList[i].unitPrice =
            (productData as any).salePrice
            ?? (productData as any).unitPrice
            ?? (productData as any).price
            ?? (productData as any).sellingPrice
            ?? (productData as any).itemPrice
            ?? 0;
        }

        this.recomputeTotals();
      });

    }

  }

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



  onUpdateStatus(order: any, itemId: any, status: any) {

    let item: OrdersItems = new OrdersItems();
    item.itemStatus = status;
    item.orderItemId = itemId;
    item.orderId = order.orderId;


    this.orderService.updateItemStatus(item).subscribe((data: any) => {
      let returnData = data;
      if (returnData === 1) {
        window.location.reload();
      }

    });
  }




}