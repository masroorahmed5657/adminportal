import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily',
  imports: [CommonModule],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss'
})

export class ReportsComponent implements OnInit {

  yearlyFlag = true;
  monthlyFlag = false;
  weeklyflage = false;
  dailyFlage = false;

  ngOnInit(): void {

  }



  changeReports(data: any) {
    if (data == "yearly") {
      this.yearlyFlag = true;
      this.monthlyFlag = false;
      this.weeklyflage = false;
      this.dailyFlage = false;
    }

    if (data == "monthly") {
      this.yearlyFlag = false;
      this.monthlyFlag = true;
      this.weeklyflage = false;
      this.dailyFlage = false;
    }

    if (data == "yearly") {
      this.yearlyFlag = true;
      this.monthlyFlag = false;
      this.weeklyflage = false;
      this.dailyFlage = false;
    }
    if (data == "weekly") {
      this.yearlyFlag = false;
      this.monthlyFlag = false;
      this.weeklyflage = true;
      this.dailyFlage = false;
    }

    if (data == "daily") {
      this.yearlyFlag = false;
      this.monthlyFlag = false;
      this.weeklyflage = false;
      this.dailyFlage = true;
    }

  }



}

