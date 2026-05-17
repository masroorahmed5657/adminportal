import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { OrderSaleReport, ReportRequest } from '../../../shared/models/model-classes.model';
import { CacheService } from '../../../shared/services/cache.service';
import { ReportsService } from '../../../shared/services/reports.service';
import { UtilitiesService } from '../../../shared/utilities.service';
// import { ChartOptions } from '../reports.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms';

import {
  ApexResponsive,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexFill,
  NgApexchartsModule,
  ApexTooltip
} from "ng-apexcharts";



export type ChartOptions = {
  responsive: ApexResponsive[];
  series: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  title?: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  markers: any; //ApexMarkers;
};


@Component({
  selector: 'app-top10-reports',
  imports: [NgApexchartsModule, FormsModule,CommonModule,RouterModule],
  providers:[DatePipe],
  templateUrl: './top10-reports.component.html',
  styleUrl: './top10-reports.component.scss'
})

export class Top10ReportsComponent implements OnInit {


  top10ProductFlag = true;
  top10CategoryFlag = false;
  top10BrandsFlag = false;
  startDate: any;
  endDate: any;
  reportType: any;
  topNumber = 10;
  saleReportList: OrderSaleReport[] = [];
  sortOrder: 'asc' | 'desc' = 'asc'; //


  @ViewChild("chart")
  public chartPaymentCountOptions: Partial<ChartOptions> | any;

  chart!: ChartComponent;
    public chart1Options: Partial<ChartOptions> | any;
    public chartPieOptions: Partial<ChartOptions> | any;


  series: ApexAxisChartSeries = [];



  constructor(
    private route: ActivatedRoute,
    private cache: CacheService,
    private datepipe: DatePipe,
    private reportService: ReportsService,
    private router: Router,
    private utilities: UtilitiesService) { 
      this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.loadData();  // your API or refresh logic
    }
  });



    }


  title = 'angular-app';
  fileName = 'TopSale.xlsx';

  openPDF(): void {
    let DATA: any = document.getElementById('excel-table');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      let fileNamePdf='Report.pdf';
    if (this.top10ProductFlag) {
      fileNamePdf = 'TopProductsSale.pdf';  
    }
    else if (this.top10CategoryFlag) {
      fileNamePdf = 'TopCategorySale.pdf';  
    }
    else if (this.top10BrandsFlag) {
      fileNamePdf = 'TopBrandsSale.pdf';  
    }


      PDF.save(fileNamePdf);
    });
  }



  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    if (this.top10ProductFlag) {
      this.fileName = 'TopProductsSale.xlsx';  
    }
    else if (this.top10CategoryFlag) {
      this.fileName = 'TopCategorySale.xlsx';  
    }
    else if (this.top10BrandsFlag) {
      this.fileName = 'TopBrandsSale.xlsx';  
    }

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  ngOnInit(): void {

    let reportName = this.route.snapshot.paramMap.get('name');

    if (reportName === 'top10Product') {
      this.top10ProductFlag = true;
      this.top10CategoryFlag = false;
      this.top10BrandsFlag = false;
      this.chart1Options = null as any;
      this.chartPieOptions = null as any;
      this.loadData();
    }
    else if (reportName === 'top10Category') {
      this.top10ProductFlag = false;
      this.top10CategoryFlag = true;
      this.top10BrandsFlag = false;
      this.chart1Options = null as any;
      this.chartPieOptions = null as any;
      this.loadData();
    }
    else if (reportName === 'top10Brands') {
      this.top10ProductFlag = false;
      this.top10CategoryFlag = false;
      this.top10BrandsFlag = true;
      this.chart1Options = null as any;
      this.chartPieOptions = null as any;
      this.loadData();
    }

  }

  loadData(){
    let reportName = this.route.snapshot.paramMap.get('name');
    //Reset
    this.saleReportList.length=0;
    this.blankChartProduct();

    if (reportName === 'top10Product') {
      this.top10ProductFlag = true;
      this.top10CategoryFlag = false;
      this.top10BrandsFlag = false;
      this.chart1Options = null as any;
      this.chartPieOptions = null as any;

    }
    else if (reportName === 'top10Category') {
      this.top10ProductFlag = false;
      this.top10CategoryFlag = true;
      this.top10BrandsFlag = false;
      this.chart1Options = null as any;
      this.chartPieOptions = null as any;
    }
    else if (reportName === 'top10Brands') {
      this.top10ProductFlag = false;
      this.top10CategoryFlag = false;
      this.top10BrandsFlag = true;
      this.chart1Options = null as any;
      this.chartPieOptions = null as any;

    }

  }



  print() {

  }

  reportWithDate() {
    let reportRequest: ReportRequest = new ReportRequest();
    reportRequest.startDate = (this.startDate).toString();
    reportRequest.endDate = (this.endDate).toString();
    reportRequest.reportType = this.reportType;
    reportRequest.topNumber = this.topNumber;

    if (this.top10ProductFlag) {
      this.reportService.getTopProductsWithDateRange(reportRequest).subscribe((data: OrderSaleReport[]) => {
        this.saleReportList = data;
        this.makeChartProduct();
        this.makePieChartProduct();

      });

    }
    else if (this.top10CategoryFlag) {
      this.reportService.getTopCategoryWithDateRange(reportRequest).subscribe((data: OrderSaleReport[]) => {
        this.saleReportList = data;
        this.makeChartCategory();
        this.makePieChartCategory();

      });

    }
    else if (this.top10BrandsFlag) {
      this.reportService.getTopBrandsWithDateRange(reportRequest).subscribe((data: OrderSaleReport[]) => {
        this.saleReportList = data;
        this.makeChartBrands();
        this.makePieChartBrand();
      });

    }



  }

  /* ************************************************* */
  blankChartProduct(){
    let saleArray: never[] = [];
    let x_axis: never[] = [];

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

  makeChartProduct() {
    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.saleReportList.length; i++) {
      saleArray.push((this.saleReportList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.saleReportList.length; i++) {
      let xLabel = this.saleReportList[i].productName;
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
  makeChartCategory() {
    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.saleReportList.length; i++) {
      saleArray.push((this.saleReportList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.saleReportList.length; i++) {
      let xLabel = this.saleReportList[i].category;
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
  makeChartBrands() {
    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.saleReportList.length; i++) {
      saleArray.push((this.saleReportList[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.saleReportList.length; i++) {
      let xLabel = this.saleReportList[i].brandName;
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


makePieChartProduct() {
  // Prepare series (values)
  let saleArray: number[] = [];
  for (let i = 0; i < this.saleReportList.length; i++) {
    saleArray.push(Number(this.saleReportList[i].totalSale.toFixed(2)));
  }

  // Prepare labels (categories)
  let myLabels: string[] = [];
  for (let i = 0; i < this.saleReportList.length; i++) {
    myLabels.push(this.saleReportList[i].productName);
  }

  let x_axis = this.saleReportList.map(s => s.productName);

  // Build Pie Chart
  this.chartPieOptions = {
    series: saleArray ,
    chart: {
      type: "pie",
      height: 350
    },
    labels: x_axis,
    title: {
      text: "Sale ($) Pie Chart"
    },
    dataLabels: {
    enabled: true,
    formatter: function (val:any, opts:any) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${label}: $${value}`;
    }
  },
    legend: {
      show: true,
      position: "bottom"
    }
  };
}



makePieChartCategory() {
  // Prepare series (values)
  let saleArray: number[] = [];
  for (let i = 0; i < this.saleReportList.length; i++) {
    saleArray.push(Number(this.saleReportList[i].totalSale.toFixed(2)));
  }

  // Prepare labels (categories)
  let myLabels: string[] = [];
  for (let i = 0; i < this.saleReportList.length; i++) {
    myLabels.push(this.saleReportList[i].category);
  }

  let x_axis = this.saleReportList.map(s => s.category);

  // Build Pie Chart
  this.chartPieOptions = {
    series: saleArray ,
    chart: {
      type: "pie",
      height: 350
    },
    labels: x_axis,
    title: {
      text: "Sale ($) Pie Chart"
    },
    dataLabels: {
    enabled: true,
    formatter: function (val:any, opts:any) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${label}: $${value}`;
    }
  },
    legend: {
      show: true,
      position: "bottom"
    }
  };
}

makePieChartBrand() {
  // Prepare series (values)
  let saleArray: number[] = [];
  for (let i = 0; i < this.saleReportList.length; i++) {
    saleArray.push(Number(this.saleReportList[i].totalSale.toFixed(2)));
  }

  // Prepare labels (categories)
  let myLabels: string[] = [];
  for (let i = 0; i < this.saleReportList.length; i++) {
    myLabels.push(this.saleReportList[i].brandName);
  }

  let x_axis = this.saleReportList.map(s => s.brandName);

  // Build Pie Chart
  this.chartPieOptions = {
    series: saleArray ,
    chart: {
      type: "pie",
      height: 350
    },
    labels: x_axis,
    title: {
      text: "Sale ($) Pie Chart"
    },
    dataLabels: {
    enabled: true,
    formatter: function (val:any, opts:any) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${label}: $${value}`;
    }
  },
    legend: {
      show: true,
      position: "bottom"
    }
  };
}


    startDateChange() {

  }

  endDateChange() {

  }
  startTimeChange() {

  }

  endTimeChange() {

  }


  /* ******************* END ************************ */
}