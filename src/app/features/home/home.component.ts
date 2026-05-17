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
  totalCountSignupList: any;
  totalReviewsList: any;
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
  

  recentOrders: any[] = [

    {
      orderNo: "55589",
      orderDate: "20/11/2020",
      product: "./assets/img/products/bag.jpeg",
      deliveryStatus: "moving",
      amount: 385,
      discount: 30,
      location: "Los Angeles, California",
      estDeliveryDate: "22/11/2020"

    },
    {
      orderNo: "23198",
      orderDate: "22/11/2020",
      product: "./assets/img/products/toy.jpeg",
      deliveryStatus: "shipped",
      amount: 539,
      discount: 25,
      location: "Arverne, New York",
      estDeliveryDate: "27/11/2020"

    },
    {
      orderNo: "87324",
      orderDate: "26/11/2020",
      product: "./assets/img/products/pencils.jpeg",
      deliveryStatus: "pending",
      amount: 671,
      discount: 35,
      location: "Mesquite, Texas",
      estDeliveryDate: "29/11/2020"

    },
    {
      orderNo: "65673",
      orderDate: "25/11/2020",
      product: "./assets/img/products/camera.jpeg",
      deliveryStatus: "cancelled",
      amount: 490,
      discount: 21,
      location: "Hallandale, Florida",
      estDeliveryDate: "26/11/2020"

    },
  ]

  orders = [
    {
      img: './assets/img/stock/img5.jpg',
      title: 'Cake',
      desc: 'Wedding cake with macarons.',
      date: '21 mins ago',
      status: 'Delivered',
      statusClass: 'bg-primary'
    },
    {
      img: './assets/img/stock/img2.jpg',
      title: 'Pasta',
      desc: 'Cheese pasta with berries',
      date: '10 mins ago',
      status: 'Processing',
      statusClass: 'bg-warning text-dark'
    },
    {
      img: './assets/img/stock/img6.jpg',
      title: 'Stacker',
      desc: 'Creamy stacker with pie',
      date: '32 mins ago',
      status: 'On Hold',
      statusClass: 'bg-danger'
    },
    {
      img: './assets/img/stock/img4.jpg',
      title: 'Spaghetti',
      desc: 'Cheese spaghetti with almonds',
      date: '17 mins ago',
      status: 'Delivered',
      statusClass: 'bg-primary'
    },
    {
      img: './assets/img/stock/img7.jpg',
      title: 'Barbeque',
      desc: 'Guilt Free BBQ chicken',
      date: '12 mins ago',
      status: 'On Hold',
      statusClass: 'bg-danger'
    },
    {
      img: './assets/img/stock/img3.jpg',
      title: 'Pecan',
      desc: 'Homemade pecan with olives',
      date: '15 mins ago',
      status: 'Processing',
      statusClass: 'bg-warning text-dark'
    }
  ];


currentUser: any;

  constructor(
    private reportsService: ReportsService,
    private customerService: CustomerService,
    private recieveProductService: ReceiveProductService,
    private reviewService: ReviewService,
    private cache: CacheService,
    private productService: ProductsService,
    private router: Router


  ) {

  }

  ngOnInit(): void {


     let currentUserRaw = sessionStorage.getItem('currentUser');
  if (currentUserRaw) {
    try { this.currentUser = JSON.parse(currentUserRaw); } catch { }
  }

  this.appName = this.currentUser?.loginId;

    //  this.todaytotalearningList=[{id:1,name:"today",total:1000}];
    //  this.weeklytotalearningList=[{id:1,name:"weekly",total:2000}];
    //  this.monthlytotalearningList=[{id:1,name:"monthly",total:3000}];
    //  this.totalCountProductsList=[{id:1,name:"product",total:8000}];
    //  this.totalCountSaleList=[{id:1,name:"sale",total:7000}];
    //  this.totalCountOrdersList=[{id:1,name:"sale",total:3500}];
    //  this.totalCountSignupList=[{id:1,name:"sale",total:3500}];

    // this.reportservices.getTodayTotalEarning().subscribe((data:TodayTotalearning[])=>{
    //     this.todaytotalearningList=data;

    //  });

    //  this.reportservices.getWeeklyTotalEarning().subscribe((data:WeeklyTotalearning[])=>{
    //      this.weeklytotalearningList=data;
    //   });

    //  this.reportservices.getMonthlyTotalEarning().subscribe((data:MonthlTotalyearning[])=>{
    //       this.monthlytotalearningList=data;
    //  });


    //  this.reportservices.getMonthlyTotalEarning().subscribe((data:MonthlTotalyearning[])=>{
    //       this.monthlytotalearningList=data;
    //  });


    // this.reportsService.getTotalCountSale().subscribe((data:TotalCountSale[])=>{
    //   this.totalCountSaleList=data;
    // });


    this.reportsService.getTotalCountOrders().subscribe((data) => {
      this.totalCountOrdersList = data;
    });


    this.reportsService.getTotalCountProducts().subscribe((data) => {
      this.totalCountProductsList = data;
    });

    this.customerService.getAllCustomers().subscribe((data) => {
      this.totalCountSignupList = data;
    });


    this.reviewService.getReviewsList().subscribe((data: any) => {
      this.totalReviewsList = data;

    });

    this.reportsService.getDailySale().subscribe((data: OrderSaleReportResponse) => {
      this.dailySaleList = data.orderSaleReport;

    });

    this.reportsService.weeklySaleTotal().subscribe((data: OrderSaleReportResponse) => {
      this.weeklySaleList = data.orderSaleReport;

      // Calculate the grand total by summing up the sales amounts
      this.grandTotalWeekly = this.weeklySaleList.reduce((total, sale) => total + sale.totalSale, 0);

    });

    // let grandTotalCountSales = 0; // Initialize the grand total count of sales

    this.reportsService.getCurrentMonthSale().subscribe(
      (data: OrderSaleReportResponse) => {
        // Assign the received data to monthlySaleList
        this.monthlySaleList = data.orderSaleReport;

        if (this.monthlySaleList !== null && this.monthlySaleList !== undefined) {
          for (let i = 0; i < this.monthlySaleList.length; i++) {
            this.monthlySaleViewList.push(this.monthlySaleList[i]);
            if (this.monthlySaleList.length === 1) {
              break; // Exit the subscription if length is 1
            }
          }
          // Check if the length of monthlySaleList is 1

          // Add the total count of the current month's sales to the grand total count
          const totalCountSales = this.monthlySaleList.reduce((sum, order) => sum + (order.totalCount || 0), 0);
          this.grandTotalCountSales += totalCountSales;

          // Do whatever you want with the grand total count of sales, for example, log it
          console.log('Grand total count of sales so far:', this.grandTotalCountSales);
        }
      },
      error => {
        console.error('Error fetching monthly sale report:', error);
      }
    );







    let revenue = {
      chart: {
        height: 228,
        type: 'line',
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: true
      },
      series: [{
        name: 'Revenue',
        data: [10, 45, 25, 65]
      }],
      xaxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      },
      legend: {
        position: 'bottom',
        offsetY: 0,
      },
      grid: {
        borderColor: '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: 5,
          bottom: 10,
          left: 10
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return "$" + val + " Millions"
          }
        }
      },
      colors: ['#1273eb', '#59a2fb'],
    }
    var chart = new ApexCharts(
      document.querySelector("#revenue"),
      revenue
    );
    chart.render();



    let visitorsGraph = {
      chart: {
        height: 200,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5,
      },
      series: [{
        name: "Visitors",
        data: [10, 41, 35, 51, 49, 21, 37]
      }],
      grid: {
        borderColor: '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        },
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat'],
      },
      yaxis: {
        show: false,
      },
      theme: {
        monochrome: {
          enabled: true,
          color: '#1273eb',
          shadeIntensity: 0.1
        },
      },
      fill: {
        type: 'solid',
      },
      markers: {
        size: 0,
        opacity: 0.2,
        colors: ["#1273eb"],
        strokeColor: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
    }

    var chart = new ApexCharts(
      document.querySelector("#visitorsGraph"),
      visitorsGraph
    );

    chart.render();



    let sales = {
      chart: {
        height: 228,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: true
      },
      series: [{
        name: 'Sales',
        data: [10, 15, 25, 35, 45, 55, 65]
      }, {
        name: 'Revenue',
        data: [15, 20, 30, 40, 50, 60, 70]
      }],
      xaxis: {
        categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      legend: {
        position: 'bottom',
        offsetY: 0,
      },
      grid: {
        borderColor: '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 10,
          left: 10
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return "$" + val + " thousands"
          }
        }
      },
      colors: ['#1273eb', '#59a2fb'],
    }
    var chart = new ApexCharts(
      document.querySelector("#sales"),
      sales
    );
    chart.render();



    let ordersGraph = {
      chart: {
        height: 250,
        type: 'radialBar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '12px',
              fontColor: 'black',
            },
            value: {
              fontSize: '21px',
            },
            total: {
              show: true,
              label: 'Orders',
              formatter: function (w: any) {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return '250'
              }
            }
          },
          track: {
            show: true,
            margin: 7,
          },
        }
      },
      series: [75, 25],
      labels: ['New', 'Delivered'],
      colors: ['#1273eb', '#f16a5d'],
    }

    var chart = new ApexCharts(
      document.querySelector("#ordersGraph"),
      ordersGraph
    );
    chart.render();




    let earningsGraph = {
      chart: {
        height: 200,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45px',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [{
        name: 'Revenue',
        data: [2000, 3000, 4000, 5000]
      }, {
        name: 'Profit',
        data: [2500, 3500, 4500, 5500]
      }],
      legend: {
        show: false,
      },
      xaxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return "$ " + val + " thousands"
          }
        }
      },
      grid: {
        borderColor: '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
      },
      colors: ['#f16a5d', '#1273eb'],
    }
    var chart = new ApexCharts(
      document.querySelector("#earningsGraph"),
      earningsGraph
    );
    chart.render();


    let ordersGraph1 = {
      chart: {
        height: 240,
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5,
      },
      series: [{
        name: "Orders",
        data: [120, 320, 260, 490, 580, 310]
      }],
      grid: {
        borderColor: '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: -10,
          left: 20
        },
      },
      xaxis: {
        categories: ['Pizzas', 'Donuts', 'Biscuits', 'Ice Creams', 'Cakes', 'Coffee'],
      },
      yaxis: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: .4,
          opacityTo: .2,
          stops: [15, 100]
        }
      },
      colors: ['#1273eb'],
      markers: {
        size: 0,
        opacity: 0.2,
        colors: ["#1273eb"],
        strokeColor: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val
          }
        }
      },
    }

    var chart = new ApexCharts(
      document.querySelector("#ordersGraph1"),
      ordersGraph1
    );

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
    if (this.isLoggedIn) {
      //this.loginService.logOutUser();
      //this.serverLogout();
    }
    this.router.navigate(['login']);
  }
  /* ************************************************************ */

  /* *********************************************************** */
  checkRolesAccess(): boolean {
    //By Default retFlag is FALSE, means no ACCESS to current URL, until authorized Role found in Roles List
    let retFlag = false;
    let currentUrl = this.router.url;


    for (let i = 0; i < this.adminUserRolesList.length; i++) {
      let adminUserRoles: AdminUserRoles = this.adminUserRolesList[i];
      if (adminUserRoles.module === 'ALL') {
        //Has Access to All modules, for Super user

        retFlag = true;
        break;
      }
      else if (adminUserRoles.module === 'FINANCE') {

        retFlag = true;
      }
      else if (adminUserRoles.module === 'HR') {
        if (currentUrl === '/home'
          || currentUrl === '/departments'
          || currentUrl === '/storeHours'
          || currentUrl === '/salaries'
          || currentUrl === '/employees'
          || currentUrl === '/listUser'
          || currentUrl === '/addUser'
        ) {
          retFlag = true;
          break;
        }


      }
      else if (adminUserRoles.module === 'INVENTORY') {
        let prodEditUrl = '/productsEdit';
        if (prodEditUrl.indexOf(currentUrl)) {
          currentUrl = prodEditUrl;
        }

        if (currentUrl === '/products'
          || currentUrl === '/productsEdit'
          || currentUrl === '/productsAdd'
          || currentUrl === '/home'
          || currentUrl === '/departments'
          || currentUrl === '/category'
          || currentUrl === '/brands'
          || currentUrl === '/purchaseorder'
          || currentUrl === '/receiveProduct'
          || currentUrl === '/inventoryAdjustment'
          || currentUrl === '/listInvoice'
          || currentUrl === '/addInvoice'
          || currentUrl === '/supplier'
        ) {

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

  /* ************************************************************ */
  makeChartDaily() {
    /* ******* 1- No of Orders Chart ********** */

    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.dailySaleList.length; i++) {
      saleArray.push((this.dailySaleList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.dailySaleList.length; i++) {
      let xLabel = this.dailySaleList[i].orderType;
      x_axis.push(xLabel);
    }


    this.chart1Options = {
      series: [
        {
          name: "SALE",
          data: saleArray,
          label: { text: "$" }
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Sale ($) Chart"
      },
      xaxis: {
        categories: x_axis

      }
    };


  }
  /* ************************************************************ */
  makeChartWeekly() {
    /* ******* 1- No of Orders Chart ********** */

    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.weeklySaleList.length; i++) {
      saleArray.push((this.weeklySaleList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.weeklySaleList.length; i++) {
      let xLabel = this.weeklySaleList[i].dayStr;
      x_axis.push(xLabel);
    }


    this.chart1Options = {
      series: [
        {
          name: "SALE",
          data: saleArray,
          label: { text: "$" }
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Sale ($) Chart"
      },
      xaxis: {
        categories: x_axis

      }
    };


  }





}

