import { Component, OnInit } from '@angular/core';
import { AdminUser } from '../../shared/models/model-classes.model';
import { AdminUserService } from '../../shared/services/admin-user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminuser.component.html',
  styleUrl: './adminuser.component.scss'
})
export class AdminUserComponent implements OnInit {
  adminUserList: AdminUser[] = [];
  adminUserMasterList: AdminUser[] = [];
  enabledEdit: boolean[] = [];
  addFlag = false;
  spinnerDataLoad = false;
  searchName = '';
  activeRow: number | null = null;
  roles: string[] = ['SUPER', 'ADMIN', 'POS', 'AGENT'];

  // New user form model
  newAdminUser: AdminUser = this.getEmptyUser();

  // Current logged-in user
  currentUser: any = null;

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.adminUserList.length / this.pageSize));
  }

  get pagedAdminUserList(): AdminUser[] {
    const start = (this.page - 1) * this.pageSize;
    return this.adminUserList.slice(start, start + this.pageSize);
  }

  rowIndex(i: number): number {
    return (this.page - 1) * this.pageSize + i;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.activeRow = null;
  }

  constructor(private adminUserService: AdminUserService) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAdminUser();
  }

  private loadCurrentUser(): void {
    const currentUserRaw = sessionStorage.getItem('currentUser');
    if (currentUserRaw) {
      try {
        this.currentUser = JSON.parse(currentUserRaw);
      } catch (error) {
        console.error('Error parsing currentUser:', error);
      }
    }
  }

  private getEmptyUser(): AdminUser {
    return {
      userId: undefined,
      loginId: '',
      loginPassword: '',
      firstName: '',
      lastName: '',
      email: '',
      userRole: 'ADMIN',
      updatedDate: null,
      updatedBy: null
    };
  }

  resetNewUserForm(): void {
    this.newAdminUser = this.getEmptyUser();
  }

  loadAdminUser(): void {
    this.spinnerDataLoad = true;
    this.adminUserService.getAdminUserList().subscribe({
      next: (data: AdminUser[]) => {
        data.sort((a, b) => (b.userId || 0) - (a.userId || 0));
        this.adminUserList = data;
        this.adminUserMasterList = [...data];
        this.enabledEdit = new Array(data.length).fill(false);
        this.page = 1;
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error('Error loading admin users:', err);
        Swal.fire('Error', 'Failed to load admin users. Please try again.', 'error');
        this.spinnerDataLoad = false;
      }
    });
  }

  addAdminUser(): void {
    this.addFlag = !this.addFlag;
    if (!this.addFlag) {
      this.resetNewUserForm();
    }
  }

  startEdit(rowIndex: number): void {
    this.enabledEdit.fill(false);
    this.enabledEdit[rowIndex] = true;
    this.activeRow = rowIndex;
  }

  cancelEdit(rowIndex: number): void {
    if (this.adminUserMasterList[rowIndex]) {
      this.adminUserList[rowIndex] = { ...this.adminUserMasterList[rowIndex] };
    }
    this.enabledEdit[rowIndex] = false;
    this.activeRow = null;
  }

  onSave(rowIndex: number): void {
    let userToSave: any = {};
    let saveFlag = true;

    if (rowIndex === -1) {
      userToSave = { ...this.newAdminUser };
      userToSave.updatedBy = this.currentUser?.loginId || 'system';

      if (!userToSave.firstName?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter First Name', 'warning');
      } else if (!userToSave.lastName?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Last Name', 'warning');
      } else if (!userToSave.email?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Email', 'warning');
      } else if (!this.isValidEmail(userToSave.email)) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter a valid Email address', 'warning');
      } else if (!userToSave.loginId?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Login ID', 'warning');
      } else if (!userToSave.loginPassword?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Password', 'warning');
      } else if (userToSave.loginPassword.trim().length < 4) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Password must be at least 4 characters', 'warning');
      } else if (!userToSave.userRole) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please select a Role', 'warning');
      }
    } else {
      if (!this.enabledEdit[rowIndex]) return;

      const originalUser = this.adminUserList[rowIndex];
      userToSave = { ...originalUser };
      userToSave.updatedBy = this.currentUser?.loginId || 'system';

      if (!userToSave.firstName?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter First Name', 'warning');
      } else if (!userToSave.lastName?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Last Name', 'warning');
      } else if (!userToSave.email?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Email', 'warning');
      } else if (!this.isValidEmail(userToSave.email)) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter a valid Email address', 'warning');
      } else if (!userToSave.loginId?.trim()) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please enter Login ID', 'warning');
      } else if (!userToSave.userRole) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Please select a Role', 'warning');
      }

      if (!userToSave.loginPassword || userToSave.loginPassword.trim() === '') {
        delete userToSave.loginPassword;
      } else if (userToSave.loginPassword.trim().length < 4) {
        saveFlag = false;
        Swal.fire('Validation Error', 'Password must be at least 4 characters', 'warning');
      }
    }

    if (!saveFlag) return;

    this.spinnerDataLoad = true;
    this.adminUserService.save(userToSave).subscribe({
      next: (response: any) => {
        if (response && response.userId) {
          Swal.fire('Success', `User ${response.userId} saved successfully!`, 'success');
          this.loadAdminUser();
          if (rowIndex === -1) {
            this.addFlag = false;
            this.resetNewUserForm();
          } else {
            this.enabledEdit[rowIndex] = false;
            this.activeRow = null;
          }
        } else {
          Swal.fire('Error', 'Failed to save user. Please try again.', 'error');
        }
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error('Save failed:', err);
        Swal.fire('Error', err.error?.message || 'Server error occurred. Please try again.', 'error');
        this.spinnerDataLoad = false;
      }
    });
  }

  onDelete(rowIndex: number): void {
    const user = this.adminUserList[rowIndex];
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete user "${user.firstName} ${user.lastName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinnerDataLoad = true;
        this.adminUserService.delete(user.userId!).subscribe({
          next: () => {
            this.loadAdminUser();
            if (this.page > this.totalPages) {
              this.page = this.totalPages;
            }
            Swal.fire('Deleted!', 'User deleted successfully.', 'success');
            this.spinnerDataLoad = false;
          },
          error: (err: any) => {
            console.error('Delete failed:', err);
            Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
            this.spinnerDataLoad = false;
          }
        });
      }
    });
  }

  adminUserSearch(): void {
    const searchTerm = this.searchName.trim().toLowerCase();
    if (!searchTerm) {
      this.adminUserList = [...this.adminUserMasterList];
    } else {
      this.adminUserList = this.adminUserMasterList.filter(user =>
        (user.firstName?.toLowerCase() + ' ' + user.lastName?.toLowerCase()).includes(searchTerm) ||
        user.loginId?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm)
      );
    }
    this.enabledEdit = new Array(this.adminUserList.length).fill(false);
    this.activeRow = null;
    this.page = 1;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getRoleBadgeClass(role: any): any {
    switch (role) {
      case 'SUPER': return 'bg-danger';
      case 'ADMIN': return 'bg-primary';
      case 'POS': return 'bg-success';
      case 'AGENT': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}