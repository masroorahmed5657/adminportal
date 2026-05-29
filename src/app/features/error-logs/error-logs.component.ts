import { Component } from '@angular/core';
import { ErrorLogs } from '../../shared/models/model-classes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorLogsService } from '../../shared/services/error-logs.service';


@Component({
  selector: 'app-error-logs',
    imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './error-logs.component.html',
  styleUrl: './error-logs.component.scss'
})
export class ErrorLogsComponent {
  errorLogsList: ErrorLogs[] = [];

  searchText: string = '';

  selectedLog: any = null;

  constructor(private errorLogsService: ErrorLogsService) {

   
  }

ngOnInit(): void {
  this.loadLogs();
}


/* ************************ */
loadLogs() {
  this.errorLogsService.getList().subscribe(
    (data: ErrorLogs[]) => {
      this.errorLogsList = data;
    },
    (error) => {
      console.error('Error fetching error logs:', error);
    }
  );
  

}

/* ************************ */

  loadSampleData() {

    this.errorLogsList = [
      {
        error_id: 1,
        class_name: 'SalesComponent',
        method_name: 'saveInvoice()',
        log_time: new Date(),
        error_msg: 'Null Pointer Exception',
        stack_msg: 'TypeError: Cannot read properties of undefined'
      },
      {
        error_id: 2,
        class_name: 'PaymentService',
        method_name: 'processPayment()',
        log_time: new Date(),
        error_msg: 'Database Connection Failed',
        stack_msg: 'SQLTimeoutException at line 42'
      },
      {
        error_id: 3,
        class_name: 'KitchenDisplay',
        method_name: 'loadOrders()',
        log_time: new Date(),
        error_msg: 'API Error',
        stack_msg: '500 Internal Server Error'
      }
    ];
  }

  deleteLog(item: ErrorLogs) {

    if (confirm('Are you sure you want to delete this error log?')) {

      this.errorLogsService.deleteLog(item.error_id).subscribe(
        () => {
          alert('Error log deleted successfully.');

          this.errorLogsList = this.errorLogsList.filter(
            x => x.error_id != item.error_id
          );
        }
      );  
    }
  }

  viewLog(item: ErrorLogs) {

    this.selectedLog = item;
  }

  closeModal() {

    this.selectedLog = null;
  }

  filteredLogs() {

    if (!this.searchText) {
      return this.errorLogsList;
    }

    return this.errorLogsList.filter(x =>

      x.class_name?.toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.method_name?.toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.error_msg?.toLowerCase()
        .includes(this.searchText.toLowerCase())

    );
  }

}
