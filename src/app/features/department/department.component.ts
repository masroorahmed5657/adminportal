import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentsService } from '../../shared/services/departments.service';
import { Departments } from '../../shared/models/model-classes.model';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
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

  constructor(private deptService: DepartmentsService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // ✅ activeFlag ab boolean hai (true = Active, false = Inactive)
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
        // ✅ Agar backend se pehle se boolean aa raha hai to ye line optional hai,
        // lekin agar kabhi 'Y'/'N' ya 0/1 mix aaye to normalize kar deti hai
        this.departmentsList = data.map(d => ({
          ...d,
          activeFlag: this.normalizeToBoolean(d.activeFlag)
        }));
        this.page = 1; // reset to first page on fresh load
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load departments', 'error');
        this.isLoading = false;
      }
    });
  }

  // ✅ Helper: kisi bhi format (Y/N, 1/0, true/false) ko boolean bana deta hai
  private normalizeToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (value === 'Y' || value === '1' || value === 1) return true;
    return false;
  }

  // Search with debounce
  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.page = 1; // reset to first page whenever the search changes
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

  // Add / Edit / View
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
    // ✅ ensure boolean rahay (JSON stringify/parse se type change nahi hota, phir bhi safe check)
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

  // File selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Save (with optional image upload)
  save(): void {
    if (!this.department.deptName?.trim()) {
      Swal.fire('Validation', 'Department name is required', 'warning');
      return;
    }
    if (!this.department.printerName?.trim()) {
      Swal.fire('Validation', 'Printer name is required', 'warning');
      return;
    }

    this.isSaving = true;

    // ✅ activeFlag ko explicitly boolean bana kar bhej rahay hain
    const deptToSave = {
      ...this.department,
      activeFlag: this.normalizeToBoolean(this.department.activeFlag)
    };

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

  // Delete
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

  // Remove image
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
}