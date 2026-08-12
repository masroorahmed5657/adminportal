import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentsService } from '../../shared/services/departments.service';
import { AdminUser, Departments } from '../../shared/models/model-classes.model';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  // UI flags
  showAddFlag = false;
  editMode = false;
  isLoading = false;
  isSaving = false;
  showDetailModal = false;

  // Search
  searchTerm = '';
  private searchDebounce: any;

  // Data
  departmentsList: Departments[] = [];
  department: Departments = this.getEmptyDepartment();
  viewDepartment: Departments = this.getEmptyDepartment();

  // Selected file for upload
  selectedFile: File | null = null;

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDepartments.length / this.pageSize));
  }

  get pagedDepartments(): Departments[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredDepartments.slice(start, start + this.pageSize);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  constructor(private deptService: DepartmentsService) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  private getEmptyDepartment(): Departments {
    return {
      deptId: null,
      deptName: '',
      activeFlag: true,
      printerName: '',
      finalImage: '',
      imageType: '',
      updatedDate: null,
      updatedBy: ''
    };
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.deptService.getDepartmentList().subscribe({
      next: (data) => {
        this.departmentsList = data.map(d => ({ ...d }));
        this.page = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load departments', 'error');
        this.isLoading = false;
      }
    });
  }

  private normalizeToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (value === 'Y' || value === '1' || value === 1) return true;
    return false;
  }

  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.page = 1;
    }, 300);
  }

  get filteredDepartments(): Departments[] {
    if (!this.searchTerm.trim()) return this.departmentsList;
    const term = this.searchTerm.toLowerCase();
    return this.departmentsList.filter(dept =>
      dept.deptName?.toLowerCase().includes(term) ||
      dept.printerName?.toLowerCase().includes(term) ||
      dept.deptId?.toString().includes(term)
    );
  }

  addDepartment(): void {
    this.showAddFlag = false;
    this.editMode = false;
    this.department = this.getEmptyDepartment();
    this.selectedFile = null;
    this.showAddFlag = true;
  }

  editDepartment(dept: Departments): void {
    this.showAddFlag = true;
    this.editMode = true;
    this.department = JSON.parse(JSON.stringify(dept));
    this.department.activeFlag = this.normalizeToBoolean(this.department.activeFlag);
    this.selectedFile = null;
  }

  viewDetail(dept: Departments): void {
    this.viewDepartment = JSON.parse(JSON.stringify(dept));
    this.viewDepartment.activeFlag = this.normalizeToBoolean(this.viewDepartment.activeFlag);
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
  }

  goToList(): void {
    this.showAddFlag = false;
    this.editMode = false;
    this.department = this.getEmptyDepartment();
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  save(): void {
    if (!this.department.deptName?.trim()) {
      Swal.fire('Validation', 'Department name is required', 'warning');
      return;
    }
    if (!this.department.printerName?.trim()) {
      Swal.fire('Validation', 'Printer name is required', 'warning');
      return;
    }

    if (!this.validateData()) {
      return;
    }


    const loggedInUser: AdminUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.isSaving = true;

    const deptToSave = {
      ...this.department,
      activeFlag: this.normalizeToBoolean(this.department.activeFlag)
    };

    deptToSave.updatedBy = loggedInUser?.loginId;

    this.deptService.saveDep(deptToSave).subscribe({
      next: (saved) => {
        if (this.selectedFile) {
          this.deptService.upload(this.selectedFile, saved.deptId).subscribe({
            next: () => {
              Swal.fire('Success', 'Department saved with image', 'success');
              this.onSaveComplete();
            },
            error: () => {
              Swal.fire('Warning', 'Department saved but image upload failed', 'warning');
              this.onSaveComplete();
            }
          });
        } else {
          Swal.fire('Success', 'Department saved successfully', 'success');
          this.onSaveComplete();
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save department', 'error');
        this.isSaving = false;
      }
    });
  }

  private onSaveComplete(): void {
    this.isSaving = false;
    this.showAddFlag = false;
    this.editMode = false;
    this.selectedFile = null;
    this.loadDepartments();
  }

  onDelete(deptId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.deptService.delete(deptId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Department has been deleted.', 'success');
            this.loadDepartments();
            if (this.editMode && this.department.deptId === deptId) {
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

  deleteImage(deptId: number): void {
    Swal.fire({
      title: 'Remove image?',
      text: 'This action cannot be undone.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deptService.deleteImage(deptId).subscribe({
          next: () => {
            Swal.fire('Removed', 'Image removed successfully', 'success');
            this.loadDepartments();
            if (this.editMode && this.department.deptId === deptId) {
              this.department.finalImage = '';
            }
          },
          error: () => Swal.fire('Error', 'Failed to remove image', 'error')
        });
      }
    });
  }
  /* ******************************************************** */
  /* ****************************************************************** */
  validateData() {
    let bRet = true;

    //Check for duplicate department name
    const duplicate = this.departmentsList.find(
      x => x.deptName?.toLowerCase() === this.department.deptName?.toLowerCase()
    );
    if (duplicate) {
      Swal.fire({
        title: 'Department Name already exists',
        text: 'Please choose a different department name.',
        icon: 'warning'
      });
      return false;
    }

    //Check for emptry department name
    if (!this.department.deptName || this.department.deptName.trim() === '') {
      Swal.fire({
        title: 'Department Name Required',
        text: 'Please enter a department name.',
        icon: 'warning'
      });
      return false;
    }
    //Check for Alphabetic department name
    //const alphabeticRegex = /^[A-Za-z\s]+$/;
    const alphabeticRegex = /^[A-Za-z][A-Za-z0-9\s]*$/;
    if (!alphabeticRegex.test(this.department.deptName)) {
      Swal.fire({
        title: 'Invalid Department Name',
        text: 'Department name should contain only alpha numeric characters.',
        icon: 'warning'
      });
      return false;
    }
    //check for leading ad trailing spaces
    if (this.department.deptName !== this.department.deptName.trim()) {
      Swal.fire({
        title: 'Invalid Department Name',
        text: 'Department name should not have leading or trailing spaces.',
        icon: 'warning'
      });
      return false;
    }
    //Check for special characters in department name
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharRegex.test(this.department.deptName)) {
      Swal.fire({
        title: 'Invalid Department Name',
        text: 'Department name should not contain special characters.',
        icon: 'warning'
      });
      return false;
    }
    //Check for department name length
    if (this.department.deptName.length > 50) {
      Swal.fire({
        title: 'Invalid Department Name',
        text: 'Department name should not exceed 50 characters.',
        icon: 'warning'
      });
      return false;
    }
    else {
      return true;
    }

  }


}