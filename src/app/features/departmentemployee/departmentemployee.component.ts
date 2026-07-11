import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentEmployee, Departments, Employees } from '../../shared/models/model-classes.model';
import { forkJoin } from 'rxjs';
import { DepartmentEmployeeService } from '../../shared/services/departmentemployee.service';

declare var bootstrap: any;

@Component({
  selector: 'app-department-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departmentemployee.component.html',
  styleUrls: ['./departmentemployee.component.scss']
})
export class DepartmentEmployeeComponent implements OnInit {

  deptEmpList: DepartmentEmployee[] = [];
  filteredList: DepartmentEmployee[] = [];
  departmentList: Departments[] = [];
  employeeList: Employees[] = [];
  formData: DepartmentEmployee = new DepartmentEmployee();
  isEdit = false;
  modal: any;
  filterDeptId: any = '';

  constructor(private service: DepartmentEmployeeService) {}

  ngOnInit(): void {
    forkJoin({
      deptEmps: this.service.getAllDeptEmployees(),
      departments: this.service.getAllDepartments(),
      employees: this.service.getAllEmployees()
    }).subscribe({
      next: ({ deptEmps, departments, employees }) => {
        this.deptEmpList = deptEmps;
        this.filteredList = deptEmps;
        this.departmentList = departments;
        this.employeeList = employees;
      },
      error: () => Swal.fire('Error', 'Failed to load data', 'error')
    });
  }

  getDeptName(deptId: any): string {
    const dept = this.departmentList.find(d => d.deptId === deptId);
    return dept ? dept.deptName : deptId;
  }

  getEmpName(empId: any): string {
    const emp = this.employeeList.find(e => e.empId === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : empId;
  }

  onFilterChange(): void {
    if (this.filterDeptId) {
      this.filteredList = this.deptEmpList.filter(d => d.deptId == this.filterDeptId);
    } else {
      this.filteredList = [...this.deptEmpList];
    }
  }

  onClearFilter(): void {
    this.filterDeptId = '';
    this.filteredList = [...this.deptEmpList];
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = new DepartmentEmployee();
    this.showModal();
  }

  onEdit(de: DepartmentEmployee): void {
    this.isEdit = true;
    this.formData = { ...de };
    this.showModal();
  }

  onSave(): void {
    if (!this.formData.deptId || !this.formData.empId) {
      Swal.fire('Warning', 'Please select department and employee', 'warning');
      return;
    }
    const obs = this.isEdit
      ? this.service.updateDeptEmployee(this.formData)
      : this.service.saveDeptEmployee(this.formData);

    obs.subscribe({
      next: () => {
        Swal.fire('Success', `Employee ${this.isEdit ? 'updated' : 'assigned'} successfully!`, 'success');
        this.hideModal();
        this.loadData();
      },
      error: () => Swal.fire('Error', 'Failed to save', 'error')
    });
  }

  onDelete(deptId: any, empId: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This assignment will be removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.deleteDeptEmployee(deptId, empId).subscribe({
          next: () => { Swal.fire('Removed!', 'Employee removed.', 'success'); this.loadData(); },
          error: () => Swal.fire('Error', 'Failed to remove', 'error')
        });
      }
    });
  }

  loadData(): void {
    this.service.getAllDeptEmployees().subscribe({
      next: (data) => { this.deptEmpList = data; this.onFilterChange(); },
      error: () => {}
    });
  }

  showModal(): void {
    const el = document.getElementById('deptEmpModal');
    if (el) { this.modal = new bootstrap.Modal(el); this.modal.show(); }
  }

  hideModal(): void {
    if (this.modal) this.modal.hide();
  }
}