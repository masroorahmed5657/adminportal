import { Component, OnInit } from '@angular/core';
import { AdminUser } from '../../shared/models/model-classes.model';
import { AdminUserService } from '../../shared/services/admin-user.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

<<<<<<< HEAD
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


  constructor(
    private adminUserService: AdminUserService,
    private deptService: DepartmentsService,
    private notify: NotificationService
  ) { }
=======
  constructor(private adminUserService: AdminUserService) { }
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAdminUser();
  }

<<<<<<< HEAD
  addAdminUser() { this.addFlag = !this.addFlag; }

  loadAdminUser() {
    this.spinnerDataLoad = true;
    this.adminUserService.getAdminUserList().subscribe({
      next: (data: AdminUser[]) => {
        data.sort((a, b) => b.userId - a.userId);

        this.adminUserList = data;
        this.adminUserMasterList = data;
        this.page = 1;
=======
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
        // Initialize edit flags
        this.enabledEdit = new Array(data.length).fill(false);
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error('Error loading admin users:', err);
        Swal.fire('Error', 'Failed to load admin users. Please try again.', 'error');
        this.spinnerDataLoad = false;
      }
    });
  }

<<<<<<< HEAD

  /** START EDIT */
  activeRow: number | null = null;

  startEdit(row: any) {
    this.enabledEdit = [];
    this.enabledEdit[row] = true;
    this.activeRow = row;
  }

  onSave(row: any) {
    let emp: any = {};
    let saveFlag = true;

    let currentUserRaw = sessionStorage.getItem('currentUser');
    if (currentUserRaw) {
      try { this.currentUser = JSON.parse(currentUserRaw); } catch { }
    }

    if (row < 0) {
      emp.loginId = (document.getElementById('loginId-new') as HTMLInputElement)?.value || null;
      emp.loginPassword = (document.getElementById('loginPassword-new') as HTMLInputElement)?.value || null;
      emp.firstName = (document.getElementById('firstName-new') as HTMLInputElement)?.value || null;
      emp.lastName = (document.getElementById('lastName-new') as HTMLInputElement)?.value || null;
      emp.email = (document.getElementById('email-new') as HTMLInputElement)?.value || null;
      emp.userRole = (document.getElementById('userRole-new') as HTMLSelectElement)?.value || null;

      emp.updatedBy = this.currentUser?.loginId ?? null;

      if (!emp.firstName) { saveFlag = false; this.notify.warning('Please enter First Name'); }
      if (!emp.email) {
        saveFlag = false; this.notify.warning('Please enter Email');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) {
        saveFlag = false; this.notify.warning('Invalid Email format');
      }

      if (!emp.loginId) {
        saveFlag = false; this.notify.warning('Please enter LoginId');
      }

    } else {
      if (!this.enabledEdit[row]) return;

      const e = this.adminUserList[row];
      emp.userId = e.userId;
      emp.loginId = e.loginId;
      emp.loginPassword = e.loginPassword || null;
      emp.firstName = e.firstName || null;
      emp.lastName = e.lastName || null;
      emp.email = e.email || null;
      emp.updatedBy = this.currentUser?.loginId ?? null;
      emp.userRole = e.userRole;

      if (!emp.firstName) { saveFlag = false; this.notify.warning('Please enter First Name'); }
      if (!emp.email) {
        saveFlag = false; this.notify.warning('Please enter Email');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) {
        saveFlag = false; this.notify.warning('Invalid Email format');
      }

      if (!emp.loginId) {
        saveFlag = false; this.notify.warning('Please enter LoginId');
      }

      if (saveFlag) this.enabledEdit[row] = false;
    }

    if (!saveFlag) return;

    this.adminUserService.save(emp).subscribe({
      next: (data: any) => {
        if (data && data.userId != null) {
          this.notify.success(`You have saved User ${data.userId} successfully!`);

          this.enabledEdit[row] = false;
          this.activeRow = null;

          this.loadAdminUser();
          if (row < 0) this.addFlag = false;
        } else {
          this.notify.error('Error in saving User');
        }
      },
      error: (err: any) => {
        console.error('Save failed:', err);
        this.notify.error('Server error occurred. Please try again.');
      }
    });
  }


  async onDelete(row: any) {
    const confirmed = await this.notify.confirmDelete('this user');
    if (!confirmed) {
      this.notify.info('User is safe');
      return;
    }

    this.adminUserService.delete(this.adminUserList[row].userId).subscribe({
      next: () => {
        this.adminUserList.splice(row, 1);

        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }

        this.notify.success('User deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.notify.error('Failed to delete User');
=======
  addAdminUser(): void {
    this.addFlag = !this.addFlag;
    if (!this.addFlag) {
      this.resetNewUserForm();
    }
  }

  startEdit(rowIndex: number): void {
    // Disable all other edit modes
    this.enabledEdit.fill(false);
    this.enabledEdit[rowIndex] = true;
    this.activeRow = rowIndex;
  }

  cancelEdit(rowIndex: number): void {
    // Reload original data for this row to discard changes
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
      // New user
      userToSave = { ...this.newAdminUser };
      userToSave.updatedBy = this.currentUser?.loginId || 'system';
      
      // Validation
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
      // Existing user
      if (!this.enabledEdit[rowIndex]) return;
      
      const originalUser = this.adminUserList[rowIndex];
      userToSave = { ...originalUser };
      userToSave.updatedBy = this.currentUser?.loginId || 'system';
      
      // Validation
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
      
      // If password is empty during edit, remove it from update payload (keep existing)
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
          this.loadAdminUser(); // Reload the list
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
            this.loadAdminUser(); // Reload the list
            Swal.fire('Deleted!', 'User deleted successfully.', 'success');
            this.spinnerDataLoad = false;
          },
          error: (err: any) => {
            console.error('Delete failed:', err);
            Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
            this.spinnerDataLoad = false;
          }
        });
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
      }
    });
  }

<<<<<<< HEAD
  adminUserSearch() {
    const name = this.searchName.trim().toLowerCase();
    this.adminUserList = this.adminUserMasterList.filter(emp => {
      const empName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
      return name ? empName.includes(name) : true;
    });
    this.page = 1;
  }
=======
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
    // Reset edit flags for filtered results
    this.enabledEdit = new Array(this.adminUserList.length).fill(false);
    this.activeRow = null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getRoleBadgeClass(role: any): any {
    switch(role) {
      case 'SUPER': return 'bg-danger';
      case 'ADMIN': return 'bg-primary';
      case 'POS': return 'bg-success';
      case 'AGENT': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
}