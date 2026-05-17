import { Component } from '@angular/core';


// import { ChartOptions } from 'chart.js';
// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ChartComponent,
//   ApexDataLabels,
//   ApexYAxis,
//   ApexLegend,
//   ApexXAxis,
//   ApexTooltip,
//   ApexTheme,
//   ApexResponsive,
//   ApexGrid,
//   ApexPlotOptions
// }
// from 'ng-apexcharts';

// export type salesChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   stroke: any;
//   theme: ApexTheme;
//   tooltip: ApexTooltip;
//   dataLabels: ApexDataLabels;
//   legend: ApexLegend;
//   colors: string[];
//   markers: any;
//   grid: ApexGrid;
//   plotOptions: ApexPlotOptions;
// };

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent {

  // @ViewChild("chart")

  // public salesChartOptions: Partial<salesChartOptions>;

  // @ViewChild("chart")
  // chart!: ChartComponent;
  // public chartOptions: Partial<ChartOptions> | any;

  // @ViewChild("chart")
  // public chart1Options: Partial<ChartOptions> | any;

  // @ViewChild("chart")
  // public chart2Options: Partial<ChartOptions> | any;

  constructor() {
    // this.salesChartOptions = {
    //   series: [
    //     {
    //       name: 'Ipad',
    //       data: [0, 300, 100, 200, 1200, 100, 500, 100]
    //     },
    //     {
    //       name: 'Iphone',
    //       data: [0, 500, 600, 800, 2800, 900, 800, 2200]
    //     }
    //   ],
    //   chart: {
    //     fontFamily: 'Nunito Sans,sans-serif',
    //     height: 250,
    //     type: 'area',
    //     toolbar: {
    //       show: false
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   markers: {
    //     size: 3,
    //     strokeColors: 'transparent',
    //   },
    //   stroke: {
    //     curve: 'smooth',
    //     width: '2',
    //   },
    //   colors: ['#2962ff', '#4fc3f7'],
    //   legend: {
    //     show: false,
    //   },
    //   grid: {
    //     show: true,
    //     strokeDashArray: 0,
    //     borderColor: 'rgba(0,0,0,0.1)',
    //     xaxis: {
    //       lines: {
    //         show: true
    //       }
    //     },
    //     yaxis: {
    //       lines: {
    //         show: true
    //       }
    //     }
    //   },
    //   xaxis: {
    //     type: 'category',
    //     categories: [
    //       'Feb',
    //       'Mar',
    //       'Apr',
    //       'May',
    //       'Jun',
    //       'Jul',
    //       'Aug',
    //       'Sep'
    //     ],
    //     labels: {
    //       style: {
    //         colors: '#a1aab2'
    //       }
    //     }
    //   },
    //   tooltip: {
    //     theme: 'dark'
    //   }
    // };
  }

  ngOnInit(): void {

    /****************Sale chart */

    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "New Customers",
    //       data: [31, 40, 28, 51, 42, 109, 100]
    //     },
    //     {
    //       name: "Up/Cross-Selling",
    //       data: [11, 32, 45, 32, 34, 52, 41]
    //     }
    //   ],
    //   chart: {
    //     height: 350,
    //     type: "area"
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     curve: "smooth"
    //   },
    //   xaxis: {
    //     categories: [
    //       "Jan",
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "June",
    //       "July"
    //     ]
    //   },
    //   tooltip: {
    //     x: {
    //       format: "dd/MM/yy HH:mm"
    //     }
    //   }
    // };

    /****************Cost BreakDown chart */

    // this.chart1Options = {
    //   series: [67, 33],
    //   chart: {
    //     type: "donut"
    //   },
    //   labels: ["Marketing", "Sales"],
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         chart: {
    //           width: 200
    //         },
    //         legend: {
    //           position: "bottom"
    //         }
    //       }
    //     }
    //   ]
    // };

    /****************Accumulated chart */

    // this.chart2Options = {
    //   series: [
    //     {
    //       name: "blue",
    //       data: [
    //         {
    //           x: "Previous Revenue",
    //           y: [1, 5]
    //         },
    //         {
    //           x: "New Revenue",
    //           y: [4, 6]
    //         },
    //         {
    //           x: "Upsell",
    //           y: [5, 8]
    //         },
    //         {
    //           x: "Lost Revenue",
    //           y: [3, 11]
    //         }
    //       ]
    //     },
    //     {
    //       name: "green",
    //       data: [
    //         {
    //           x: "Previous Revenue",
    //           y: [2, 6]
    //         },
    //         {
    //           x: "New Revenue",
    //           y: [1, 3]
    //         },
    //         {
    //           x: "Upsell",
    //           y: [7, 8]
    //         },
    //         {
    //           x: "Lost Revenue",
    //           y: [5, 9]
    //         }
    //       ]
    //     }
    //   ],
    //   chart: {
    //     type: "rangeBar",
    //     height: 350
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false
    //     }
    //   },
    //   dataLabels: {
    //     enabled: true
    //   }
    // };

    /****************Incremental Sales chart */


  }
}
