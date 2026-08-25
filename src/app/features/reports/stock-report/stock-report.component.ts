import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-report.component.html',
  styleUrl: './stock-report.component.scss'
})
export class StockReportComponent {
  startDate = this.today();
  endDate = this.today();
  showRequirement = false;

  showBackendRequirement(): void {
    this.showRequirement = true;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
