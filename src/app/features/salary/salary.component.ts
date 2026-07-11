// salary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SalaryService } from '../../shared/services/salary.service';
import { Salary, SalaryView } from '../../shared/models/model-classes.model';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  salaryList: SalaryView[] = [];
  formData: Salary = new Salary();
  isEdit = false;
  modal: any; // for Bootstrap modal

  constructor(private salaryService: SalaryService) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.salaryService.getAllSalaries().subscribe({
      next: (data: SalaryView[]) => {
        this.salaryList = data;
      },
      error: () => Swal.fire('Error', 'Failed to load salaries', 'error')
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = new Salary();
    this.showModal();
  }

  onEdit(salary: SalaryView): void {
    this.isEdit = true;
    // Convert SalaryView to Salary for editing
    this.formData = {
      salaryId: salary.salaryId,
      empId: salary.empId,
      basicSalary: salary.basicSalary,
      allowances: salary.allowances,
      bonuses: salary.bonuses,
      deductions: salary.deductions,
      taxes: salary.taxes,
      netSalary: salary.netSalary,
      salaryMonth: salary.salaryMonth,
      paymentMode: salary.paymentMode,
      paymentDate: salary.paymentDate,
      status: salary.status,
      createdAt: salary.createdAt,
      updatedAt: salary.updatedAt
    };
    this.showModal();
  }

  onSave(): void {
    const obs = this.isEdit
      ? this.salaryService.updateSalary(this.formData)
      : this.salaryService.saveSalary(this.formData);

    obs.subscribe({
      next: () => {
        Swal.fire('Success', `Salary ${this.isEdit ? 'updated' : 'saved'} successfully!`, 'success');
        this.hideModal();
        this.loadSalaries();
      },
      error: () => Swal.fire('Error', 'Failed to save salary', 'error')
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This salary record will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then(result => {
      if (result.isConfirmed) {
        this.salaryService.deleteSalary(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Salary deleted.', 'success');
            this.loadSalaries();
          },
          error: () => Swal.fire('Error', 'Failed to delete salary', 'error')
        });
      }
    });
  }

  // Helper functions for Bootstrap modal (same as your payment component)
  showModal(): void {
    const el = document.getElementById('salaryModal');
    if (el) {
      this.modal = new (window as any).bootstrap.Modal(el);
      this.modal.show();
    }
  }

  hideModal(): void {
    if (this.modal) this.modal.hide();
  }
}