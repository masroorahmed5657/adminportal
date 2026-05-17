import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QurbaniResponse, QurbaniCount, CategoryQty } from '../../../shared/models/model-classes.model';
import { ReportsService } from '../../../shared/services/reports.service';
// import { ChartOptions } from '../reports.component';
import { HeaderComponent } from "../../../layouts/header/header.component";
import { FooterComponent } from "../../../layouts/footer/footer.component";


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
  selector: 'app-qurbani',
  imports: [HeaderComponent, FooterComponent,NgApexchartsModule,CommonModule],
  providers:[DatePipe],
  templateUrl: './qurbani.component.html',
  styleUrl: './qurbani.component.scss'
})

export class QurbaniComponent implements OnInit {

  @ViewChild("chart")
  chart!: ChartComponent;
  public chart1Options: Partial<ChartOptions> | any;

  @ViewChild("chart")
  public chart3Options: Partial<ChartOptions> | any;


  qurbaniResponse: QurbaniResponse = new QurbaniResponse();
  qurbaniCountList: QurbaniCount[] = [];
  xData: string[] = [];
  yData: number[] = [];
  totalQurbani: any;
  totalPriceSale: any = 0;
  currentDateTime: any;
  firstDrill = false;

  constructor(private reportService: ReportsService, public datepipe: DatePipe) {
    this.currentDateTime = this.datepipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
  }

  ngOnInit(): void {
    /* ******* 1- No of Orders Chart ********** */

    //Get Count
    this.reportService.getQurbaniCount().subscribe((data: QurbaniResponse) => {
      //this.deptList=data ;

      if (data != null || data != undefined) {
        this.qurbaniResponse = data;
        for (let i = 0; i < this.qurbaniResponse.categoryQtyList.length; i++) {
          let qurbani: CategoryQty = this.qurbaniResponse.categoryQtyList[i];
          this.yData.push(qurbani.quantity);
          let xDataText = qurbani.productName + " ($" + qurbani.price + ")";
          this.xData.push(xDataText);
          this.totalPriceSale = this.totalPriceSale + qurbani.price;

        }//for


        this.totalQurbani = this.currentDateTime + ' - ' + '$' + this.totalPriceSale;

        let t1 = 0;

        this.chart1Options = {
          series: [
            {
              name: "No. Of Qurbani",
              data: this.yData,

              labels: {
                offsetY: 5,
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",
                  colors: ["#304758"]
                }
              }


            }

          ],
          chart: {
            height: 450,

            type: "bar",
            labels: {
              offsetY: 5,
              style: {
                fontSize: "18px",
                fontWeight: "bold",
                colors: ["#304758"]
              }
            },
            events: {
              dataPointSelection: (event: any, chartContext: any, config: any) => {
                //console.log(chartContext, config);
                console.log('chartContext', config);
                let t1 = config.dataPointIndex;
                let t2 = this.qurbaniResponse.categoryQtyList[t1];
                this.firstDrill = true;
                console.log('Category', t2);

              }
            }
          },
          title: {
            text: "No. Of Qurbani",
            style: {
              fontSize: "18px",
              fontWeight: "bold",
              colors: ["#304758"]
            }

          },
          dataLabels: {
            enabled: true,
            formatter: function (val: string) {
              return val + "%";
            },
            offsetY: 5,
            style: {
              fontSize: "24px",
              colors: ["#304758"]
            }
          },
          xaxis: {
            categories: this.xData,
            labels: {
              offsetY: 5,
              style: {
                fontSize: "18px",
                fontWeight: "bold",
                colors: ["#304758"]
              }
            }

          }

        };



      }

    });


    /* ******* 3- Order By Sub Category Per Month Chart ********** */

    this.chart3Options = {
      series: [44, 55, 88, 43, 22, 10, 35],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Beef", "Mutton", "Chicken", "Veal", "Seafood", "Turkey", "Deli"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };




  }//ngOnInit




}//End of component

