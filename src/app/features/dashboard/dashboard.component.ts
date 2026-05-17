import { Component, OnInit } from '@angular/core';
// import { FooterComponent } from '../../layout/footer/footer.component';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { SimplebarAngularModule } from 'simplebar-angular';
import { OverlayPanel, OverlayPanelModule} from 'primeng/overlaypanel'
import { PrimeNGConfig } from 'primeng/api';
import { Table, TableModule } from 'primeng/table'
import { CalendarModule } from 'primeng/calendar';
import { productdata } from './data';
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
//import countUp from 'react-countup';

import { latLng, tileLayer, circle, polygon, marker, icon, Layer } from 'leaflet';
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
  ApexTooltip,
  NgApexchartsModule
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
  selector: 'app-dashboard',
  imports: [SimplebarAngularModule, ScrollPanelModule, DropdownModule, BadgeModule,DialogModule,TranslateModule, 
    NgClass, SidebarModule, TranslateModule, NgClass, FormsModule, ReactiveFormsModule, OverlayPanelModule, TableModule, NgApexchartsModule, CalendarModule   ],
  providers:[],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})


export class DashboardComponent implements OnInit{
  revenueChart: any;
  customerChart: any;
  radialbarChart: any;
  date3!: Date;
  products: any;
  filters!: any[];
  datePipe: any;
  //countUp:any[]=[];

  //   products!: productdata[];

  constructor(private primengConfig: PrimeNGConfig) { }


  ngOnInit(): void {
    this._revenueChart('["--tb-secondary", "--tb-danger", "--tb-success"]');
    this._customerChart('["--tb-primary", "--tb-success"]');
    this._radialbarChart('["--tb-primary", "--tb-danger", "--tb-success", "--tb-secondary"]');

    this.products = productdata

    const currTime = new Date().getTime();
    this.filters = [];
    this.filters.push({ label: 'All days', value: null });
    this.filters.push({ label: 'Last 1 day', value: [this.createFilterDate(currTime)] });
    this.filters.push({ label: 'Last 7 days', value: Array(...new Array(7)).map((item, index) => this.createFilterDate(currTime - index * 1000 * 60 * 60 * 24)) });
    this.filters.push({ label: 'Last 20 days', value: Array(...new Array(20)).map((item, index) => this.createFilterDate(currTime - index * 1000 * 60 * 60 * 24)) });

    // Set world-map-line-markers amchart
    let root = am5.Root.new("world-map-line-markers");

    root.setThemes([am5themes_Animated.new(root)]);


    let chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "none",
            panY: "none",
            opacity: 1,
            projection: am5map.geoMercator(),
        })
    );

    chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"],
            fill: am5.color("rgb(222, 226, 232)"),
            stroke: am5.color("#fff"),
        })
    );
}
statuses: any[] | undefined;


onSortChange(event: any) {
    let value = event.value;
}


createFilterDate(time: string | number | Date) {
}

// Chart Colors Set
private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
        var newValue = value.replace(" ", "");
        if (newValue.indexOf(",") === -1) {
            var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color) {
                color = color.replace(" ", "");
                return color;
            }
            else return newValue;;
        } else {
            var val = value.split(',');
            if (val.length == 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
}

/**
* Revenue Chart
*/
private _revenueChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.revenueChart = {
        chart: {
            height: 405,
            zoom: {
                enabled: true
            },
            toolbar: {
                show: false
            }
        },
        colors: colors,
        stroke: {
            width: [2, 2, 2],
            curve: 'smooth'
        },
        series: [{
            name: "Orders",
            type: 'line',
            data: [180, 274, 346, 290, 370, 420, 490, 542, 510, 580, 636, 745]
        },
        {
            name: "Refunds",
            type: 'area',
            data: [100, 154, 302, 411, 300, 284, 273, 232, 187, 174, 152, 122]
        },
        {
            name: "Earnings",
            type: 'line',
            data: [260, 360, 320, 345, 436, 527, 641, 715, 832, 794, 865, 933]
        }
        ],
        fill: {
            type: ['solid', 'gradient', 'solid'],
            gradient: {
                shadeIntensity: 1,
                type: "vertical",
                inverseColors: false,
                opacityFrom: 0.3,
                opacityTo: 0.0,
                stops: [20, 80, 100, 100]
            },
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    show: false
                },
            }
        }]
    };
}

/**
* Customer Satisfaction Chart
*/
private _customerChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.customerChart = {
        series: [{
            name: 'This Month',
            data: [49, 54, 48, 54, 67, 88, 96]
        }, {
            name: 'Last Month',
            data: [57, 66, 74, 63, 55, 70, 85]
        }],
        chart: {
            height: 250,
            type: 'area',
            toolbar: {
                show: false
            }
        },
        fill: {
            type: ['gradient', 'gradient'],
            gradient: {
                shadeIntensity: 1,
                type: "vertical",
                inverseColors: false,
                opacityFrom: 0.3,
                opacityTo: 0.0,
                stops: [50, 70, 100, 100]
            },
        },
        markers: {
            size: 4,
            colors: "#ffffff",
            strokeColors: colors,
            strokeWidth: 1,
            strokeOpacity: 0.9,
            fillOpacity: 1,
            hover: {
                size: 6,
            }
        },
        grid: {
            show: false,
            padding: {
                top: -35,
                right: 0,
                bottom: 0,
                left: -6,
            },
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [2, 2],
            curve: 'smooth'
        },
        colors: colors,
        xaxis: {
            labels: {
                show: false,
            }
        },
        yaxis: {
            labels: {
                show: false,
            }
        },
    };
}


/**
* multiple radialbar Chart
*/
private _radialbarChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.radialbarChart = {
        series: [85, 69, 45, 78],
        chart: {
            height: 300,
            type: 'radialBar',
        },
        sparkline: {
            enabled: true
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Sales',
                        formatter: function (w: any) {
                            return 2922
                        }
                    }
                }
            }
        },
        labels: ['Fashion', 'Electronics', 'Groceries', 'Others'],
        colors: colors,
        legend: {
            show: false,
            fontSize: '16px',
            position: 'bottom',
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
        },
    };
}

/**
  * Choropleth Maps
  */
choropleth = {
    layers: [
        tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w", {
            id: "mapbox/light-v9",
            tileSize: 512,
            zoomOffset: -1,
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        })
    ],
    zoom: 1.1,
    center: latLng(28, 1.5)
};
choroplethLayers = [
    circle([41.9, 12.45], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([12.05, -61.75], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([1.3, 103.8], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
];

/**
* Sale Location Map
*/
options = {
    layers: [
        tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
            id: "mapbox/light-v9",
            tileSize: 512,
            zoomOffset: -1,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        })
    ],
    zoom: 1.1,
    center: latLng(28, 1.5)
};
layers = [
    circle([41.9, 12.45], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([12.05, -61.75], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([1.3, 103.8], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
];
}
