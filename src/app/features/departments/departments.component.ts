import { Component } from '@angular/core';
import { Departments } from '../../shared/models/model-classes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DepartmentsService } from '../../shared/services/departments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {


  department: Departments = new Departments();

  departmentsList: Departments[] = [];
  currentUser: any;

  searchText: string = '';

  constructor(private departmentService: DepartmentsService) {

  }

  /* ************************ */
  ngOnInit() {

    // Current user
    let user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }


    this.loadDepartments();
  }
  /* ************************ */

  loadDepartments() {
    this.departmentService.getDepartmentList().subscribe({
      next: (data: Departments[]) => {
        this.departmentsList = data.reverse();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // loadSampleData() {

  //     this.departmentsList = [
  //         {
  //             deptId: 1,
  //             deptName: 'Kitchen',
  //             activeFlag: true,
  //             printerName: 'Kitchen Printer',
  //             updatedDate: new Date(),
  //             updatedBy: 'Admin',
  //             finalImage: '',
  //             imageType: ''
  //         },
  //         {
  //             deptId: 2,
  //             deptName: 'Bar',
  //             activeFlag: true,
  //             printerName: 'Bar Printer',
  //             updatedDate: new Date(),
  //             updatedBy: 'Admin',
  //             finalImage: '',
  //             imageType: ''
  //         }
  //     ];
  // }
  /* ****************************************************************** */
  saveDepartment() {

    if (!this.department.deptName) {
      alert('Department Name Required');
      return;
    }

    if (this.department.deptId) {

      const index = this.departmentsList.findIndex(
        x => x.deptId == this.department.deptId
      );

      if (index != -1) {

        // this.department.updatedDate = new Date();
        this.department.updatedBy = this.currentUser?.loginId || 'Admin';//'Admin';

        this.departmentsList[index] = {
          ...this.department
        };
      }

    } else {

      // this.department.deptId = Date.now();

      // this.department.updatedDate = new Date();

      this.department.updatedBy = this.currentUser?.loginId || 'Admin';//'Admin';

      this.departmentsList.unshift({
        ...this.department
      });
    }

    this.departmentService.saveDep(this.department).subscribe({
      next: (data) => {
        console.log('Department saved successfully:', data);
      },
      error: (err) => {
        console.error('Error saving department:', err);
      }
    });


    //this.resetForm();
  }
  /* ****************************************************************** */
  editDepartment(item: Departments) {

    this.department = {
      ...item
    };
  }
  /* ****************************************************************** */
  deleteDepartment(item: Departments) {

    // if (confirm('Are you sure you want to delete this department?')) {

    //     this.departmentsList = this.departmentsList.filter(
    //         x => x.deptId != item.deptId
    //     );
    // }


    Swal.fire({
      title: 'Are you sure you want to delete this department?',
      text: 'You cannot recover this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {
      if (response.isConfirmed) {

        this.departmentService.delete(item.deptId).subscribe({
          next: () => {


            this.departmentsList = this.departmentsList.filter(
              x => x.deptId != item.deptId
            );

            Swal.fire('Deleted!', 'department has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting department:', err);
            Swal.fire('Error', 'Failed to delete department', 'error');
          }
        });

    } 
    else if (response.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your department is safe', 'info');
    }
    });


  }
  /* ****************************************************************** */
  resetForm() {

    this.department = new Departments();

    this.department.activeFlag = true;
  }

  /* ****************************************************************** */
  filteredDepartments() {

    if (!this.searchText) {
      return this.departmentsList;
    }

    return this.departmentsList.filter(x =>
      x.deptName?.toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }
  /* ****************************************************************** */

  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.department.imageType = file.type;

    const reader = new FileReader();

    reader.onload = () => {
      this.department.finalImage = reader.result;
    };

    reader.readAsDataURL(file);
  }


}
