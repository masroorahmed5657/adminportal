import { Component, OnInit } from '@angular/core';
import { AdminUser } from '../../shared/models/model-classes.model';
import { AdminUserService } from '../../shared/services/admin-user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';

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

  constructor(
    private adminUserService: AdminUserService,
    private notify: NotificationService
  ) { }

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
        this.notify.error('Failed to load admin users. Please try again.');
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
        this.notify.warning('Please enter First Name');
      } else if (!userToSave.lastName?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Last Name');
      } else if (!userToSave.email?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Email');
      } else if (!this.isValidEmail(userToSave.email)) {
        saveFlag = false;
        this.notify.warning('Please enter a valid Email address');
      } else if (!userToSave.loginId?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Login ID');
      } else if (!userToSave.loginPassword?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Password');
      } else if (userToSave.loginPassword.trim().length < 4) {
        saveFlag = false;
        this.notify.warning('Password must be at least 4 characters');
      } else if (!userToSave.userRole) {
        saveFlag = false;
        this.notify.warning('Please select a Role');
      }
    } else {
      if (!this.enabledEdit[rowIndex]) return;

      const originalUser = this.adminUserList[rowIndex];
      userToSave = { ...originalUser };
      userToSave.updatedBy = this.currentUser?.loginId || 'system';

      if (!userToSave.firstName?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter First Name');
      } else if (!userToSave.lastName?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Last Name');
      } else if (!userToSave.email?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Email');
      } else if (!this.isValidEmail(userToSave.email)) {
        saveFlag = false;
        this.notify.warning('Please enter a valid Email address');
      } else if (!userToSave.loginId?.trim()) {
        saveFlag = false;
        this.notify.warning('Please enter Login ID');
      } else if (!userToSave.userRole) {
        saveFlag = false;
        this.notify.warning('Please select a Role');
      }

      if (!userToSave.loginPassword || userToSave.loginPassword.trim() === '') {
        delete userToSave.loginPassword;
      } else if (userToSave.loginPassword.trim().length < 4) {
        saveFlag = false;
        this.notify.warning('Password must be at least 4 characters');
      }
    }

    if (!saveFlag) return;

    this.spinnerDataLoad = true;
    this.adminUserService.save(userToSave).subscribe({
      next: (response: any) => {
        if (response && response.userId) {
          this.notify.success(`User ${response.userId} saved successfully!`, 'Success');
          this.loadAdminUser();
          if (rowIndex === -1) {
            this.addFlag = false;
            this.resetNewUserForm();
          } else {
            this.enabledEdit[rowIndex] = false;
            this.activeRow = null;
          }
        } else {
          this.notify.error('Failed to save user. Please try again.');
        }
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error('Save failed:', err);
        this.notify.error(err.error?.message || 'Server error occurred. Please try again.');
        this.spinnerDataLoad = false;
      }
    });
  }

  async onDelete(rowIndex: number) {
    const user = this.adminUserList[rowIndex];
    const confirmed = await this.notify.confirmDelete(`user "${user.firstName} ${user.lastName}"`);

    if (!confirmed) {
      return;
    }

    this.spinnerDataLoad = true;
    this.adminUserService.delete(user.userId!).subscribe({
      next: () => {
        this.loadAdminUser();
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
        this.notify.success('User deleted successfully.');
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error('Delete failed:', err);
        this.notify.error('Failed to delete user. Please try again.');
        this.spinnerDataLoad = false;
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