import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OrderSaleReport, TotalCountSale, Product, AdminUserRoles, OrderSaleReportResponse } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CustomerService } from '../../shared/services/customer.service';
import { ProductsService } from '../../shared/services/products.service';
import { ReceiveProductService } from '../../shared/services/receive-product.service';
import { ReportsService } from '../../shared/services/reports.service';
import { ReviewService } from '../../shared/services/review.service';
import { ChartOptions } from '../dashboard/dashboard.component';
import { faSignOut, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from "../../layouts/header/header.component";
import { CommonModule } from '@angular/common';

declare var ApexCharts: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  selectedCategory: any;
  dailySaleList: OrderSaleReport[] = [];
  weeklySaleList: OrderSaleReport[] = [];
  monthlySaleList: OrderSaleReport[] = [];
  monthlySaleViewList: OrderSaleReport[] = [];
  monthlySaleList1: any[] = [];
  public chart1Options: Partial<ChartOptions> | any;

  totalCountSaleList: TotalCountSale[] = [];
  totalCountOrdersList: any;
  totalCountProductsList: any;
  totalCountSignupList: any[] = [];
  totalReviewsList: any[] = [];
  totalProductsCount: any = 0;

  // NEW dynamic data sources (replacing dummy arrays)
  latestProducts: any[] = [];
  expiringProducts: any[] = [];

  productViewList: Product[] = [];
  orderFlag = false;
  posFlag = false;
  reportsFlag = false;
  inventoryFlag = false;
  financeFlag = false;
  hrFlag = false;
  newsAlertFlag = false;
  warehouseFlag = false;
  faSignOut = faSignOut;
  public isLoggedIn = false;
  adminUserRolesList: AdminUserRoles[] = [];
  appName = environment.appName;
  grandTotalCountSales: number = 0;
  grandTotalWeekly: number = 0;
  grandTotalMonthly: number = 0;

  currentUser: any;

  constructor(
    private reportsService: ReportsService,
    private customerService: CustomerService,
    private recieveProductService: ReceiveProductService,
    private reviewService: ReviewService,
    private cache: CacheService,
    private productService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {

    let currentUserRaw = sessionStorage.getItem('currentUser');
    if (currentUserRaw) {
      try { this.currentUser = JSON.parse(currentUserRaw); } catch { }
    }

    this.appName = this.currentUser?.loginId;

    /* ================= STAT TILES (top) ================= */
    this.reportsService.getTotalCountOrders().subscribe((data) => {
      this.totalCountOrdersList = data;
    });

    this.reportsService.getTotalCountProducts().subscribe((data) => {
      this.totalCountProductsList = data;
    });

    this.customerService.getAllCustomers().subscribe((data: any) => {
      this.totalCountSignupList = data || [];
    });

    this.reviewService.getReviewsList().subscribe((data: any) => {
      this.totalReviewsList = data || [];
    });

    this.productService.findTotalProductsCount().subscribe((data: any) => {
      this.totalProductsCount = data;
    });

    /* ================= LATEST PRODUCTS (replaces dummy "Recent Orders" table) ================= */
    this.productService.getFirstLatestProducts(6, 0).subscribe((data: any) => {
      this.latestProducts = data || [];
    });

    /* ================= EXPIRING PRODUCTS (replaces dummy food-tiles / "Orders" list) ================= */
    this.productService.getExpiryProducts(30).subscribe((data: any) => {
      this.expiringProducts = data?.productViewList || data || [];
    });

    /* ================= DAILY SALE ================= */
    this.reportsService.getDailySale().subscribe((data: OrderSaleReportResponse) => {
      this.dailySaleList = data.orderSaleReport || [];
      this.renderDailySaleBarChart();
    });

    /* ================= WEEKLY SALE ================= */
    this.reportsService.weeklySaleTotal().subscribe((data: OrderSaleReportResponse) => {
      this.weeklySaleList = data.orderSaleReport || [];
      this.grandTotalWeekly = this.weeklySaleList.reduce((total, sale) => total + (sale.totalSale || 0), 0);
      this.renderWeeklySalesChart();
    });

    /* ================= MONTHLY SALE ================= */
    this.reportsService.getCurrentMonthSale().subscribe(
      (data: OrderSaleReportResponse) => {
        this.monthlySaleList = data.orderSaleReport || [];

        if (this.monthlySaleList.length) {
          for (let i = 0; i < this.monthlySaleList.length; i++) {
            this.monthlySaleViewList.push(this.monthlySaleList[i]);
            if (this.monthlySaleList.length === 1) break;
          }

          const totalCountSales = this.monthlySaleList.reduce((sum, order) => sum + (order.totalCount || 0), 0);
          this.grandTotalCountSales += totalCountSales;

          this.grandTotalMonthly = this.monthlySaleList.reduce((total, sale) => total + (sale.totalSale || 0), 0);
        }

        this.renderMonthlyBreakdownChart();
        this.renderProductsHealthChart();
      },
      error => {
        console.error('Error fetching monthly sale report:', error);
      }
    );
  }

  /* ================================================================
     CHART RENDER METHODS — all built from REAL fetched data (no dummy)
     ================================================================ */

  /** Weekly Sales bar chart — built from weeklySaleList (dayStr / totalSale) */
  renderWeeklySalesChart() {
    const el = document.querySelector("#sales");
    if (!el || !this.weeklySaleList.length) return;

    const categories = this.weeklySaleList.map(s => s.dayStr || s.orderType || '');
    const values = this.weeklySaleList.map(s => s.totalSale || 0);

    let sales = {
      chart: { height: 228, type: 'bar', stacked: false, toolbar: { show: false }, zoom: { enabled: true } },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: true },
      series: [{ name: 'Sales', data: values }],
      xaxis: { categories: categories },
      legend: { position: 'bottom', offsetY: 0 },
      grid: {
        borderColor: '#e0e6ed', strokeDashArray: 5,
        xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } },
        padding: { top: 0, right: 0, bottom: 10, left: 10 },
      },
      yaxis: { show: false },
      fill: { opacity: 1 },
      tooltip: { y: { formatter: (val: string) => "Rs " + val } },
      colors: ['#1273eb', '#59a2fb'],
    };

    el.innerHTML = '';
    const chart = new ApexCharts(el, sales);
    chart.render();
  }

  /** Revenue / Monthly breakdown chart — built from monthlySaleList (orderType / totalSale) */
  renderMonthlyBreakdownChart() {
    const el = document.querySelector("#revenue");
    if (!el || !this.monthlySaleList.length) return;

    const categories = this.monthlySaleList.map(s => s.orderType || '');
    const values = this.monthlySaleList.map(s => s.totalSale || 0);

    let revenue = {
      chart: { height: 228, type: 'line', stacked: false, toolbar: { show: false }, zoom: { enabled: true } },
      dataLabels: { enabled: true },
      series: [{ name: 'Revenue', data: values }],
      xaxis: { categories: categories },
      legend: { position: 'bottom', offsetY: 0 },
      grid: {
        borderColor: '#e0e6ed', strokeDashArray: 5,
        xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } },
        padding: { top: 0, right: 5, bottom: 10, left: 10 },
      },
      yaxis: { show: false },
      fill: { opacity: 1 },
      tooltip: { y: { formatter: (val: string) => "Rs " + val } },
      colors: ['#1273eb', '#59a2fb'],
    };

    el.innerHTML = '';
    const chart = new ApexCharts(el, revenue);
    chart.render();
  }

  /** Daily sale bar chart, per orderType — replaces the old "Orders Graph Placeholder" */
  renderDailySaleBarChart() {
    const el = document.querySelector("#ordersGraph1");
    if (!el || !this.dailySaleList.length) return;

    const categories = this.dailySaleList.map(s => s.orderType || '');
    const values = this.dailySaleList.map(s => s.totalSale || 0);

    let dailyChart = {
      chart: { height: 240, type: 'area', zoom: { enabled: false }, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 5 },
      series: [{ name: "Sale", data: values }],
      grid: {
        borderColor: '#e0e6ed', strokeDashArray: 5,
        xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } },
        padding: { top: 0, right: 0, bottom: -10, left: 20 },
      },
      xaxis: { categories: categories },
      yaxis: { show: false },
      fill: {
        type: "gradient",
        gradient: { type: "vertical", shadeIntensity: 1, inverseColors: false, opacityFrom: .4, opacityTo: .2, stops: [15, 100] }
      },
      colors: ['#1273eb'],
      markers: { size: 0, opacity: 0.2, colors: ["#1273eb"], strokeColor: "#fff", strokeWidth: 2, hover: { size: 7 } },
      tooltip: { y: { formatter: (val: any) => "Rs " + val } },
    };

    el.innerHTML = '';
    const chart = new ApexCharts(el, dailyChart);
    chart.render();
  }

  /** Products health radial chart — Active products vs Total products (real counts) */
  renderProductsHealthChart() {
    const el = document.querySelector("#ordersGraph");
    if (!el) return;

    const active = Number(this.totalCountProductsList) || 0;
    const total = Number(this.totalProductsCount) || active || 1;
    const activePct = Math.min(100, Math.round((active / total) * 100));
    const inactivePct = 100 - activePct;

    let productsGraph = {
      chart: { height: 250, type: 'radialBar', toolbar: { show: false } },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '12px' },
            value: { fontSize: '21px' },
            total: {
              show: true,
              label: 'Active',
              formatter: () => active.toString()
            }
          },
          track: { show: true, margin: 7 },
        }
      },
      series: [activePct, inactivePct],
      labels: ['Active', 'Inactive'],
      colors: ['#1273eb', '#f16a5d'],
    };

    el.innerHTML = '';
    const chart = new ApexCharts(el, productsGraph);
    chart.render();
  }

  /* ************************************************************ */
  signOut() {
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.clear();
    this.cache.resetAllData();
    this.isLoggedIn = false;
    this.router.navigate(['login']);
  }
  /* ************************************************************ */

  checkRolesAccess(): boolean {
    let retFlag = false;
    let currentUrl = this.router.url;

    for (let i = 0; i < this.adminUserRolesList.length; i++) {
      let adminUserRoles: AdminUserRoles = this.adminUserRolesList[i];
      if (adminUserRoles.module === 'ALL') {
        retFlag = true;
        break;
      }
      else if (adminUserRoles.module === 'FINANCE') {
        retFlag = true;
      }
      else if (adminUserRoles.module === 'HR') {
        if (currentUrl === '/home' || currentUrl === '/departments' || currentUrl === '/storeHours'
          || currentUrl === '/salaries' || currentUrl === '/employees' || currentUrl === '/listUser'
          || currentUrl === '/addUser') {
          retFlag = true;
          break;
        }
      }
      else if (adminUserRoles.module === 'INVENTORY') {
        let prodEditUrl = '/productsEdit';
        if (prodEditUrl.indexOf(currentUrl)) {
          currentUrl = prodEditUrl;
        }
        if (currentUrl === '/products' || currentUrl === '/productsEdit' || currentUrl === '/productsAdd'
          || currentUrl === '/home' || currentUrl === '/departments' || currentUrl === '/category'
          || currentUrl === '/brands' || currentUrl === '/purchaseorder' || currentUrl === '/receiveProduct'
          || currentUrl === '/inventoryAdjustment' || currentUrl === '/listInvoice' || currentUrl === '/addInvoice'
          || currentUrl === '/supplier') {
          retFlag = true;
          break;
        }
      }
      else if (adminUserRoles.module === 'NEWS') {
        if (currentUrl === '/newsTracker' || currentUrl === '/home') {
          retFlag = true;
          break;
        }
      }
      else if (adminUserRoles.module === 'ORDERS') {
        if (currentUrl === '/order' || currentUrl === '/home') {
          retFlag = true;
          break;
        }
      }
      else if (adminUserRoles.module === 'POS') {
        if (currentUrl === '/counterSale' || currentUrl === '/home') {
          retFlag = true;
          break;
        }
      }
      else if (adminUserRoles.module === 'REPORTS') {
        if (currentUrl === '/qurbaniReport' || currentUrl === '/home') {
          retFlag = true;
          break;
        }
      }
      else if (adminUserRoles.module === 'WAREHOUSE') {
        if (currentUrl === '/warehouse' || currentUrl === '/home') {
          retFlag = true;
          break;
        }
      }
    }

    return retFlag;
  }
  /* ********************************************************** */

  makeChartDaily() {
    let saleArray = [];
    for (let i = 0; i < this.dailySaleList.length; i++) {
      saleArray.push((this.dailySaleList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.dailySaleList.length; i++) {
      x_axis.push(this.dailySaleList[i].orderType);
    }

    this.chart1Options = {
      series: [{ name: "SALE", data: saleArray, label: { text: "$" } }],
      chart: { height: 350, type: "bar" },
      title: { text: "Sale ($) Chart" },
      xaxis: { categories: x_axis }
    };
  }

  makeChartWeekly() {
    let saleArray = [];
    for (let i = 0; i < this.weeklySaleList.length; i++) {
      saleArray.push((this.weeklySaleList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.weeklySaleList.length; i++) {
      x_axis.push(this.weeklySaleList[i].dayStr);
    }

    this.chart1Options = {
      series: [{ name: "SALE", data: saleArray, label: { text: "$" } }],
      chart: { height: 350, type: "bar" },
      title: { text: "Sale ($) Chart" },
      xaxis: { categories: x_axis }
    };
  }

}