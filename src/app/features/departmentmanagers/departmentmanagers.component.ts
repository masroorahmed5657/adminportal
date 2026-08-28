import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentManager, Departments, Employees } from '../../shared/models/model-classes.model';

import { forkJoin } from 'rxjs';
import { DepartmentManagerService } from '../../shared/services/departmentservice.service';

declare var bootstrap: any;

@Component({
  selector: 'app-department-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departmentmanagers.component.html',
  styleUrls: ['./departmentmanagers.component.scss']
})
export class DepartmentManagerComponent implements OnInit {

  managerList: DepartmentManager[] = [];
  departmentList: Departments[] = [];
  employeeList: Employees[] = [];
  formData: DepartmentManager = new DepartmentManager();
  isEdit = false;
  modal: any;

  constructor(private service: DepartmentManagerService) {}

  ngOnInit(): void {
    forkJoin({
      managers: this.service.getAllManagers(),
      departments: this.service.getAllDepartments(),
      employees: this.service.getAllEmployees()
    }).subscribe({
      next: ({ managers, departments, employees }) => {
        this.managerList = managers;
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

  openAddModal(): void {
    this.isEdit = false;
    this.formData = new DepartmentManager();
    this.showModal();
  }

  onEdit(m: DepartmentManager): void {
    this.isEdit = true;
    this.formData = { ...m };
    this.showModal();
  }

  onSave(): void {
    if (!this.formData.deptId || !this.formData.empId) {
      Swal.fire('Warning', 'Please select department and employee', 'warning');
      return;
    }

    const obs = this.isEdit
      ? this.service.updateManager(this.formData)
      : this.service.saveManager(this.formData);

    obs.subscribe({
      next: () => {
        Swal.fire('Success', `Manager ${this.isEdit ? 'updated' : 'assigned'} successfully!`, 'success');
        this.hideModal();
        this.loadManagers();
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
        this.service.deleteManager(deptId, empId).subscribe({
          next: () => { Swal.fire('Removed!', 'Manager removed.', 'success'); this.loadManagers(); },
          error: () => Swal.fire('Error', 'Failed to remove', 'error')
        });
      }
    });
  }

  loadManagers(): void {
    this.service.getAllManagers().subscribe({
      next: (data) => this.managerList = data,
      error: () => Swal.fire('Error', 'Failed to load', 'error')
    });
  }

  showModal(): void {
    const el = document.getElementById('deptManagerModal');
    if (el) { this.modal = new bootstrap.Modal(el); this.modal.show(); }
  }

  hideModal(): void {
    if (this.modal) this.modal.hide();
  }
}