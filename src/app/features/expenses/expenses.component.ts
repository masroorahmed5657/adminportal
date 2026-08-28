import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Categories, Expenses, ExpensesView, FinanceCategory } from '../../shared/models/model-classes.model';
import { Router } from '@angular/router';
import { CacheService } from '../../shared/services/cache.service';
import { NotificationService } from '../../shared/services/notification.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExpenseService } from '../../shared/services/expense-service.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {

  addEditFlag = false;   // false = list, true = add/edit
  editIndex: number | null = null;
  expensesList: ExpensesView[] = [];
  categoriesList: FinanceCategory[] = [];
  expenseForm: Expenses = new Expenses();
  expenses: Expenses = new Expenses();
  totalExpense = 0;
  reportDate: any;
  
  isSaving = false; // 👈 Added this flag to prevent multiple API calls

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.expensesList.length / this.pageSize));
  }

  get pagedExpensesList(): ExpensesView[] {
    const start = (this.page - 1) * this.pageSize;
    return this.expensesList.slice(start, start + this.pageSize);
  }

  rowIndex(i: number): number {
    return (this.page - 1) * this.pageSize + i;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  constructor(
    private cache: CacheService,
    private router: Router,
    private expenseService: ExpenseService,
    private notify: NotificationService
  ) {

  }

  currency = environment.currency;

  selectedYear!: number;
  selectedMonth!: number | '';

  years: number[] = [];
  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];


  ngOnInit(): void {
    this.addEditFlag = false;

    const today = new Date();
    this.reportDate = today;

    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth() + 1;

    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.years.push(i);
    }



    this.expenseService.getCategoryList().subscribe((data: FinanceCategory[]) => {
      this.categoriesList = data;
    });

    this.expenseService.getExpenseByDateList(this.selectedYear, this.selectedMonth).subscribe((data: ExpensesView[]) => {
      this.expensesList = data;

      this.totalExpense = this.getTotalAmount();
      this.page = 1; // reset to first page on fresh load


    });


  }

  onFilterChange() {
    //console.log(this.selectedYear, this.selectedMonth);
  }

  loadReport() {
    this.expenseService.getExpenseByDateList(this.selectedYear, this.selectedMonth).subscribe((data: ExpensesView[]) => {
      this.expensesList = data;

      this.totalExpense = this.getTotalAmount();
      this.page = 1; // reset to first page whenever a new report loads


    });


  }



  getTotalByType(type: 'expense' | 'income'): number {
    return this.expensesList
      .filter(e => e.transactionType === type)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }



  getTotalAmount(): number {
    return this.expensesList.reduce(
      (total, item) => total + (Number(item.amount) || 0),
      0
    );
  }


  editExpense(row: any) {
    this.addEditFlag = true;
    this.expenseForm = this.expensesList[row];
  }

  async onDelete(expenseId: any, row: any) {
    const confirmed = await this.notify.confirmDelete('this Expense');
    if (!confirmed) {
      this.notify.info('Expense is safe');
      return;
    }

    this.expenseService.deleteExpenses(expenseId).subscribe(() => {
      window.location.reload();
    }, (error) => {
      this.notify.error('Failed to delete expense. Try again.');
    });
  }

  addExpense() {
    this.addEditFlag = true;
    this.expenseForm.transactionType = 'EXPENSE';
  }

  saveExpense() {
    if (this.isSaving) return; // 👈 Prevent multiple clicks if already saving
    this.isSaving = true;      // 👈 Set flag to true

    let desc = this.expenseForm.description;

    this.expenseService.saveExpenses(this.expenseForm).subscribe(
      (data: Expenses) => {
        this.isSaving = false; // 👈 Reset on response
        
        let retExpense = data;
        if (data !== null) {
          if (data === undefined) {
            this.notify.error('Error in saving Expenses');
          }
          else {
            if (retExpense.expenseId !== null) {

              this.notify.success('You have saved Expenses ' + retExpense.expenseId + ' Succesfully!', 'Submit');
              window.location.reload();

            }
          }
        }
      },
      (error) => {
        this.isSaving = false; // 👈 Reset on error
        this.notify.error('Failed to save expense. Please try again.');
      }
    );
  }

  cancel() {
    this.addEditFlag = false;
  }

  /* ******************************************************* */

  exportToPDF() {
    const elements = document.querySelectorAll('.pdf-hide');
    elements.forEach(el => el.classList.add('d-none'));

    const content = document.getElementById('print-table');

    if (!content) return;

    html2canvas(content, {
      scale: 2,            // better quality
      useCORS: true,
      scrollY: -window.scrollY
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Expense-Report.pdf');

      // Restore hidden elements
      elements.forEach(el => el.classList.remove('d-none'));
    }).catch(() => {
      // Restore even if error occurs
      elements.forEach(el => el.classList.remove('d-none'));
    });
  }


  exportToPDF2() {
    const elements = document.querySelectorAll('.pdf-hide');
    elements.forEach(el => el.classList.add('d-none'));
    elements.forEach(el => el.classList.remove('d-none'));
  }


  openPDF(): void {
    let DATA: any = document.getElementById('print-table');

    const elements = document.querySelectorAll('.pdf-hide');
    elements.forEach(el => el.classList.add('d-none'));

    elements.forEach(el => el.classList.remove('d-none'));

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('expense.pdf');
    });
  }

  print() {
    let printWindow: any;

    const printContentObj = document.getElementById('print-table');
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
      }

      table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          thead {border: 2px solid black;background-color:none;}
     </style>
     `;

    let bodyHtmlTag =
      `<title>Daily Sale Report</title>
     </head>    
     <body  onload="window.print();window.close();">`;

    let footerHtml =
      `</body>
     </html>
       `;

    let finalHTMLTag = headHtmlTag + styleTag + bodyHtmlTag + printContent + footerHtml;
    printWindow.document.open();
    printWindow.document.write(finalHTMLTag);

    printWindow.document.close();
  }

}