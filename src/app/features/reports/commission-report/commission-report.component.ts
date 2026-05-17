import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AgentSaleReport, ReportRequest, AgentSaleReportResponse } from '../../../shared/models/model-classes.model';
import { ReportsService } from '../../../shared/services/reports.service';
// import { ChartOptions } from '../reports.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
import { FormsModule } from '@angular/forms';


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
  selector: 'app-commission-report',
  imports: [RouterModule, FontAwesomeModule, FormsModule, CommonModule, NgApexchartsModule],
  templateUrl: './commission-report.component.html',
  styleUrl: './commission-report.component.scss'
})

export class CommissionReportComponent implements OnInit {

  @ViewChild("chart")
  public chartPaymentCountOptions: Partial<ChartOptions> | any;

  chart!: ChartComponent;
  public chartCommissionSale: Partial<ChartOptions> | any;

  chart2!: ChartComponent;
  public chartCommissionCount: Partial<ChartOptions> | any;


  series: ApexAxisChartSeries = [];


  faSignOut = faSignOut;
  selectedMonth: any;
  filteredMonthlyItems: any;

  filteredYearlyItems: any;
  selectedYear: any;
  legacyReport: boolean = false;



  startDate: Date = new Date();
  endDate: Date = new Date();
  startTime: any;
  endTime: any;
  totalAgentsCount = 0;
  totalSale = 0;
  totalCommission = 0;
  totalTax = 0;
  totalReturn = 0;
  totalReturnTax = 0;

  agentSaleReport: AgentSaleReport[] = [];

  sortOrder: 'asc' | 'desc' = 'asc'; //
  showTaxFlag = environment.showTaxFlag;



  title = 'Commission Report';
  fileName = 'DailySale.xlsx';
  printFlag = false;


  print() {
    let printWindow: any;

    this.printFlag = true;
    const printContentObj = document.getElementById('saleReport');
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
            .no-print { display: none; }
            .page-break {page-break-after: always;
            .yes-print {display: table-column}
			}

      table { width: 100%; border-collapse: collapse; }
          th, td { border: 0px solid black; padding: 8px; text-align: left; }
          thead {border: 0px solid black;background-color:none;}
     </style>
     `;

    let bodyHtmlTag =
      `<title>Daily Sale Report</title>
     </head>    
     <body  onload="window.print();window.close();">`;



    let tableTag = `<table  id="agent-sale-table" >
                <thead  style="border: 0px solid black; width: 100%;">
                  <tr ><td  colspan="6" style="margin-top: 25px;">
                  <h4  style="text-align: center;">Agent Sale Commission</h4>
                  </td></tr>
                  <tr  >
                  <th > Agent ID </th>
                  <th > Agent Name </th>
                  <th > # of Sale</th>
                  <th> Return </th>
                  <th > Sale Amount(Rs.) </th>
                  <th > Commission% </th>
                  <th > Commission </th>
                  </tr></thead>
                  <tbody  style="border-bottom-style: solid; border-width: 0.1px;">`;





    let trTag = ``;
    for (let i = 0; i < this.agentSaleReport.length; i++) {
      trTag += `<tr>
                <td >` + this.agentSaleReport[i].loginId + `</td>
                <td >` + this.agentSaleReport[i].firstName + `&nbsp;` + this.agentSaleReport[i].lastName + `</td>
                <td >` + this.agentSaleReport[i].totalCount + `</td>
                <td >` + this.agentSaleReport[i].totalReturn + `</td>
                <td >` + this.agentSaleReport[i].totalSale + `</td>
                <td >` + this.agentSaleReport[i].tax + `</td>
                <td>` + this.agentSaleReport[i].commissionPercentage + `</td>
                <td>` + this.agentSaleReport[i].totalCommission + `<td> </tr>`

    }


    let tFootTag = `<tfoot  style="border-bottom-style: solid; border-width: 0.1px;">
                  <tr >
                  <td  colspan="6">&nbsp;</td></tr><tr >
                  <td  colspan="2" style="font-weight: bold;"> Total Agents #:` + this.totalAgentsCount + `</td>
                  <td  colspan="2" style="font-weight: bold;"> Total Sale: ` + this.totalSale + `</td>
                  <td  colspan="2" style="font-weight: bold;"> Total Tax: ` + this.totalTax + `</td>
                  <td  colspan="2" style="font-weight: bold;"> Total Commission:` + this.totalCommission + ` </td>
                  </tr></tfoot></table>`;

    let fullTableTag = tableTag + trTag + tFootTag;
    let footerHtml =
      `</body>
     </html>
       `;

    let finalHTMLTag = headHtmlTag + styleTag + bodyHtmlTag + fullTableTag + footerHtml;
    printWindow.document.open();
    printWindow.document.write(finalHTMLTag);

    printWindow.document.close();
    this.printFlag = false;
    //printWindow.focus();
    //printWindow.print();  

    // }
  }


  openPDF(): void {

    let DATA: any = document.getElementById('agent-sale-table');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('daily-sale.pdf');

    });



  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('agent-sale-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);



  }

  constructor(private route: ActivatedRoute,
    private reportsService: ReportsService,
    private router: Router) { }


  ngOnInit(): void {

    let datePipe = new DatePipe('en-US');
    this.startTime = datePipe.transform(new Date(), 'shortTime');
    this.endTime = datePipe.transform(new Date(), 'shortTime');


  }

  ngAfterViewInit(): void {

  }

  /* ************************************************************** */
  signOut() {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#465FFF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {

        sessionStorage.clear(); // normal session data clear

        // optional: agar remember-me bhi logout pe clear karna ho
        localStorage.removeItem('currentUser');
        localStorage.removeItem('Token');

        // this.isLoggedIn = false;
        this.router.navigate(['login']);

      }
    });
  }

  agentSaleWithDate() {
    //Get Agent Sale List for selected dates
    let reportRequest: ReportRequest = new ReportRequest();
    reportRequest.startDate = (this.startDate).toString();
    //reportRequest.startTime = (this.startTime).toString();
    reportRequest.endDate = (this.endDate).toString();
    //reportRequest.endTime = (this.endTime).toString();
    this.agentSaleReport.length = 0;
    this.totalAgentsCount = 0;
    this.totalCommission = 0;
    this.totalSale = 0;

    this.reportsService.getAgentSaleWithDate(reportRequest).subscribe((data: AgentSaleReportResponse) => {

      this.agentSaleReport = data.saleReportList;
      this.chartMake();
      this.calculateTotals();

    });


  }

  startDateChange() {

  }

  endDateChange() {

  }
  startTimeChange() {

  }

  endTimeChange() {

  }

  /* ************************************************************** */
  chkCommissionNumber(row: number) {
    let commissionInput = <HTMLInputElement>document.getElementById('commission_' + row);

    let val = commissionInput.value;

    if (commissionInput != null || commissionInput != undefined) {
      let len = commissionInput.value.length;

      let qty = Number(val);
      if (qty < 0) {
        //0 or below not allowed
        Swal.fire('WARNING', 'Negative commission is not allowed', 'warning');
        return;

      }
      if (len > 2) {
        //commissionInput.value = commissionInput.value.toString().slice(0, 2);
      }

      this.calculateCommission(commissionInput.value, row);
      this.calculateTotals();
    }
  } //chkNumber
  /* ************************************************************** */
  calculateCommission(commissionPercentage: any, row: any) {

    if (this.agentSaleReport.length === 0) return;

    let commissionPrice = (this.agentSaleReport[row].totalSale * commissionPercentage) / 100;
    this.agentSaleReport[row].commissionPercentage = commissionPercentage;
    this.agentSaleReport[row].totalCommission = ((Number((commissionPrice))));


  }
  /* ************************************************************** */
  calculateTotals(): void {
    this.totalSale = 0;
    this.totalCommission = 0;
    this.totalTax = 0;
    this.totalReturn = 0;
    this.totalReturnTax = 0;

    this.totalAgentsCount = this.agentSaleReport.length;
    for (let i = 0; i < this.agentSaleReport.length; i++) {
      this.totalSale = this.totalSale + Number(this.agentSaleReport[i].totalSale);
      this.totalTax = this.totalTax + Number(this.agentSaleReport[i].tax);

      this.totalReturn = this.totalReturn + Number(this.agentSaleReport[i].totalReturn);
      this.totalReturnTax = this.totalReturnTax + Number(this.agentSaleReport[i].returnTax);


      if (this.agentSaleReport[i].totalCommission !== undefined) {
        this.totalCommission = this.totalCommission + Number(this.agentSaleReport[i].totalCommission);
      }

    }

  }


  chartMake() {
    //this.series.
    let saleArray = [];
    for (let i = 0; i < this.agentSaleReport.length; i++) {
      saleArray.push((this.agentSaleReport[i].totalSale).toFixed(2));
    }

    let x_axis = [];
    for (let i = 0; i < this.agentSaleReport.length; i++) {
      let xLabel = this.agentSaleReport[i].firstName;
      x_axis.push(xLabel);
    }


    this.chartCommissionSale = {
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
        text: "Agent Sale ($) Chart"
      },
      xaxis: {
        categories: x_axis

      }
    };
    ////////////////////////////////////////////////////////////////////////

    let saleArray2 = [];
    let colorArray = [];
    for (let i = 0; i < this.agentSaleReport.length; i++) {
      saleArray2.push((this.agentSaleReport[i].totalCount).toFixed(2));
      colorArray.push('#FF5733');
    }

    let x_axis2 = [];
    for (let i = 0; i < this.agentSaleReport.length; i++) {
      let xLabel = this.agentSaleReport[i].firstName;
      x_axis2.push(xLabel);
    }


    this.chartCommissionCount = {
      series: [
        {
          name: "COUNT",
          data: saleArray2,
          label: { text: "$" }
        }
      ],

      chart: {
        height: 350,
        type: "bar",

      },
      colors: [{
        data: colorArray
      }
      ],
      title: {
        text: "Agent Sale Count Chart"
      },
      xaxis: {
        categories: x_axis2

      }
    };

  }

  toNumber(amount: any) {

    if (amount === undefined) {
      return 0;
    }
    else if (amount === 0) {
      return 0;
    }
    else if (amount > 0) {
      let numVal = Number(amount.toFixed(2)).toLocaleString('en');

      return numVal;

    }
    else if (amount < 0) {
      //Returns
      let numVal = Number(amount.toFixed(2)).toLocaleString('en');

      return numVal;

    }
    else {
      return amount;
    }

  }



  /* ********************** END OF CLASS ****************** */
}
