import { Component, OnInit } from '@angular/core';
import { AdminUser, Departments } from '../../shared/models/model-classes.model';
import { DepartmentsService } from '../../shared/services/departments.service';
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
  adminUserMasterList: any[] = [];
  enabledEdit: any[] = [];
  deptList: Departments[] = [];
  currentUser: any;
  addFlag = false;
  spinnerDataLoad = false;
  searchName = '';
  selectedRow: number | null = null;
  roles: string[] = ['SUPER', 'ADMIN', 'POS', 'AGENT'];
  selectedRole: string = 'ADMIN';

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

  ngOnInit(): void {
    this.deptService.getDepList().subscribe((data: Departments[]) => {
      this.deptList = data;
    });
    this.loadAdminUser();
  }

  addAdminUser() { this.addFlag = !this.addFlag; }

  loadAdminUser() {
    this.spinnerDataLoad = true;
    this.adminUserService.getAdminUserList().subscribe({
      next: (data: AdminUser[]) => {
        data.sort((a, b) => b.userId - a.userId);

        this.adminUserList = data;
        this.adminUserMasterList = data;
        this.page = 1;
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error(err);
        this.spinnerDataLoad = false;
      }
    });
  }


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
      }
    });
  }

  adminUserSearch() {
    const name = this.searchName.trim().toLowerCase();
    this.adminUserList = this.adminUserMasterList.filter(emp => {
      const empName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
      return name ? empName.includes(name) : true;
    });
    this.page = 1;
  }
}