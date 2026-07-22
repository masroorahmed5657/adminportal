import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Employees } from '../../shared/models/model-classes.model';
import { EmployeesService } from '../../shared/services/employees.service';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  // UI flags
  showAddFlag = false;
  editMode = false;
  isLoading = false;
  isSaving = false;
  showDetailModal = false;

  // Pagination & search
  page = 1;
  pageSize = 10;
  searchTerm = '';
  private searchDebounce: any;

  // Data
  employeesList: Employees[] = [];
  employee: Employees = this.getEmptyEmployee();
  viewEmployee: Employees = this.getEmptyEmployee();

  constructor(private empService: EmployeesService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  private getEmptyEmployee(): Employees {
    return {
      empId: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: null,
      gender: '',
      hireDate: null,
      updatedBy: '',
      updatedDate: null
    };
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.empService.getEmployeesList().subscribe({
      next: (data) => {
        this.employeesList = data;
        this.page = 1; // reset to first page on fresh load
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load employees', 'error');
        this.isLoading = false;
      }
    });
  }

  // Search with debounce
  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.page = 1;
    }, 300);
  }

  get filteredEmployees(): Employees[] {
    if (!this.searchTerm.trim()) return this.employeesList;
    const term = this.searchTerm.toLowerCase();
    return this.employeesList.filter(emp =>
      emp.firstName?.toLowerCase().includes(term) ||
      emp.lastName?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.empId?.toString().includes(term)
    );
  }

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
  }

  get pagedEmployees(): Employees[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  // Add / Edit / View
  addEmployee(): void {
    this.showAddFlag = true;
    this.editMode = false;
    this.employee = this.getEmptyEmployee();
  }

  editEmployee(emp: Employees): void {
    this.showAddFlag = true;
    this.editMode = true;
    this.employee = JSON.parse(JSON.stringify(emp));
  }

  viewDetail(emp: Employees): void {
    this.viewEmployee = JSON.parse(JSON.stringify(emp));
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
  }

  goToList(): void {
    this.showAddFlag = false;
    this.editMode = false;
    this.employee = this.getEmptyEmployee();
  }

  // Save
  save(): void {
    if (!this.employee.firstName?.trim()) {
      Swal.fire('Validation', 'First name is required', 'warning');
      return;
    }
    if (!this.employee.lastName?.trim()) {
      Swal.fire('Validation', 'Last name is required', 'warning');
      return;
    }

    this.isSaving = true;
    this.empService.save(this.employee).subscribe({
      next: () => {
        Swal.fire('Success', 'Employee saved successfully', 'success');
        this.onSaveComplete();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save employee', 'error');
        this.isSaving = false;
      }
    });
  }

  private onSaveComplete(): void {
    this.isSaving = false;
    this.showAddFlag = false;
    this.editMode = false;
    this.loadEmployees();
  }

  // Delete
  onDelete(empId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This employee will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.empService.delete(empId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
            this.loadEmployees();
            if (this.editMode && this.employee.empId === empId) {
              this.goToList();
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Delete failed', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }
}