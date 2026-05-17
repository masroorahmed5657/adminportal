import { Component, OnInit } from '@angular/core';
import { AdminUser, Departments } from '../../shared/models/model-classes.model';
import { DepartmentsService } from '../../shared/services/departments.service';
import { AdminUserService } from '../../shared/services/admin-user.service';
import Swal from "sweetalert2";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-adminuser',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
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


  constructor(
    private adminUserService: AdminUserService,
    private deptService: DepartmentsService
  ) { }

  ngOnInit(): void {
    this.deptService.getDepList().subscribe((data: Departments[]) => {
      this.deptList = data;
    });
    this.loadAdminUser();
  }

/*
 userId?: number;
   loginId?: any;
   loginPassword?: any;
   firstName?: string;
   lastName?: string;
   email?: string;
   userRole?: string;
   updatedDate: any;
   updatedBy: any;
*/



  addAdminUser() { this.addFlag = !this.addFlag; }

  loadAdminUser() {
    this.spinnerDataLoad = true;
    this.adminUserService.getAdminUserList().subscribe({
      next: (data: AdminUser[]) => {
        // const normalized = (data || []).map(emp => ({
        //   ...emp,
        //   gender: this.mapGenderToNumber(emp.gender)
        // }));

        data.sort((a, b) => b.userId - a.userId);

        this.adminUserList = data;
        this.adminUserMasterList = data;
        this.spinnerDataLoad = false;
      },
      error: (err: any) => {
        console.error(err);
        this.spinnerDataLoad = false;
      }
    });
  }


  /** START EDIT */
  activeRow: number | null = null; // highlight ke liye


  /* ************************ */
  startEdit(row: any) {
    this.enabledEdit = [];
    this.enabledEdit[row] = true;

    this.activeRow = row; // ye row highlight hoga
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
    emp.userRole = (document.getElementById('userRole-new') as HTMLInputElement)?.value || null;
    
    
    emp.updatedBy = this.currentUser?.loginId ?? null;

    // ✅ Validations
    if (!emp.firstName) { saveFlag = false; Swal.fire('WARNING', 'Please enter First Name', 'warning'); }
    if (!emp.email) { 
      saveFlag = false; Swal.fire('WARNING', 'Please enter Email', 'warning'); 
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) { 
      saveFlag = false; Swal.fire('WARNING', 'Invalid Email format', 'warning'); 
    }

    if (!emp.loginId) {
      saveFlag = false; Swal.fire('WARNING', 'Please enter LoginId', 'warning');
    } 
    
    // else if (!/^\d{14}$/.test(emp.phone)) {
    //   saveFlag = false; Swal.fire('WARNING', 'Phone number must be exactly 11 digits', 'warning');
    // }

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

    // ✅ Validations
    if (!emp.firstName) { saveFlag = false; Swal.fire('WARNING', 'Please enter First Name', 'warning'); }
    if (!emp.email) { 
      saveFlag = false; Swal.fire('WARNING', 'Please enter Email', 'warning'); 
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) { 
      saveFlag = false; Swal.fire('WARNING', 'Invalid Email format', 'warning'); 
    }

    if (!emp.loginId) {
      saveFlag = false; Swal.fire('WARNING', 'Please enter LoginId', 'warning');
     } 
   // else if (!/^\d{11}$/.test(emp.phone)) {
    //   saveFlag = false; Swal.fire('WARNING', 'Phone number must be exactly 11 digits', 'warning');
    // }

    if (saveFlag) this.enabledEdit[row] = false;
  }

  if (!saveFlag) return;

  // API Call Same
  this.adminUserService.save(emp).subscribe({
    next: (data: any) => {
      if (data && data.userId != null) {
        Swal.fire('Submit', `You have saved User ${data.userId} successfully!`, 'success').then(() => {
          this.enabledEdit[row] = false;
          this.activeRow = null;
        });
        this.loadAdminUser();
        if (row < 0) this.addFlag = false;
      } else {
        Swal.fire('Error', 'Error in saving User', 'error');
      }
    },
    error: (err: any) => {
      console.error('Save failed:', err);
      Swal.fire('Error', 'Server error occurred. Please try again.', 'error');
    }
  });
}


  onDelete(row: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((res) => {
      if (res.value) {
        this.adminUserService.delete(this.adminUserList[row].userId).subscribe(() => {
          this.adminUserList.splice(row, 1);
          Swal.fire('Deleted!', 'User deleted successfully.', 'success');
        });
      }
    });
  }

  adminUserSearch() {
    const name = this.searchName.trim().toLowerCase();
    this.adminUserList = this.adminUserMasterList.filter(emp => {
      const empName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
      return name ? empName.includes(name) : true;
    });
  }
}
