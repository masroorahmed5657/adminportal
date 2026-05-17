import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { AdminUser, CodeDropDown, LoginRequest, AdminUserRoles } from '../../shared/models/model-classes.model';
import { UseraddService } from '../../shared/services/user-add.service';
import { faKey, faHome, faDeleteLeft, faRemove, faUndo, faSave, faCoffee, faSignIn } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { Header2Component } from "../header2/header2.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [FooterComponent, Header2Component,CommonModule,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  faSignIn = faSignIn;
  faKey = faKey;

  roleChckedFlag = false;

  adminList: AdminUser[] = [];
  enabledEdit: any[] = [];
  addFlag = false;
  title = 'Password Change';
  closeResult: string = '';

  //Multi Select, Code added June 8, 2023
  roleList: any[] = ['ALL', 'ORDERS', 'FINANCE', 'HR', 'NEWS', 'POS', 'INVENTORY', 'REPORTS', 'WAREHOUSE'];
  selectedItems: CodeDropDown[] = [];
  dropdownSettings = {};
  selectedRoles: any[] = [];

  constructor(private userService: UseraddService) { } //, private modalService: NgbModal  ) { }

  /* ******************************************************************** */
  ngOnInit(): void {

    this.userService.getUserList().subscribe((data: AdminUser[]) => {

      this.adminList = data;

      this.roleList = [
        { id: 1, text: 'ALL' },
        { id: 2, text: 'ORDERS' },
        { id: 3, text: 'INVENTORY' },
        { id: 4, text: 'REPORTS' },
        { id: 5, text: 'NEWS' },
        { id: 6, text: 'FINANCE' },
        { id: 7, text: 'HR' },
        { id: 8, text: 'POS' },
        { id: 9, text: 'WAREHOUSE' },
      ];
      this.selectedItems = [

      ];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 8,
        allowSearchFilter: true,
        limitSelection: 7
      };

    });




  }

  /* ******************************************************************** */
  onSave(row: any) {

    let user: AdminUser = new AdminUser();
    let currentUser: AdminUser = new AdminUser();;
    let userLoggedIn = sessionStorage.getItem('currentUser');

    if (typeof (userLoggedIn) !== 'undefined' && userLoggedIn !== null && userLoggedIn !== '') {
      currentUser = JSON.parse(userLoggedIn);
    }

    if (row < 0) {
      //Add user
      user.loginId = (document.getElementById('loginId-new') as HTMLInputElement).value;
      let bFound = false;
      //Check loginId exist in system?
      for (let i = 0; i < this.adminList.length; i++) {
        if (user.loginId === this.adminList[i].loginId) {
          bFound = true;
          break;
        }

      }
      if (bFound) {
        Swal.fire('Error', 'LoginId Already Exists', 'error');
        return;
      }

      user.loginPassword = (document.getElementById('loginPassword-new') as HTMLInputElement).value;
      user.updatedBy = currentUser.loginId;
      user.firstName = (document.getElementById('firstName-new') as HTMLInputElement).value;
      user.lastName = (document.getElementById('lastName-new') as HTMLInputElement).value;
      user.email = (document.getElementById('email-new') as HTMLInputElement).value;
      let rolesObj = (document.getElementById('userRole-new') as HTMLSelectElement);
      user.userRole = this.selectedRoles.join(',');   //rolesObj.options[rolesObj.selectedIndex].value;


    }
    else {
      //EDIT
      if (!this.enabledEdit[row]) {
        return;
      }
      let i = 0;
      this.addFlag = false;//for LoginId
      user.userId = this.adminList[row].userId;
      user.loginId = this.adminList[row].loginId;
      user.loginPassword = this.adminList[row].loginPassword;

      user.updatedBy = currentUser.loginId;
      user.firstName = (document.getElementById('firstName-' + row) as HTMLInputElement).value;
      user.lastName = (document.getElementById('lastName-' + row) as HTMLInputElement).value;
      user.email = (document.getElementById('email-' + row) as HTMLInputElement).value;
      let rolesObj = (document.getElementById('userRole-' + row) as HTMLSelectElement);
      user.userRole = this.selectedRoles.join(','); //rolesObj.options[rolesObj.selectedIndex].value;

      this.enabledEdit[row] = false; //Disable Edit after save

    }//edit


    this.userService.saveUser(user).subscribe(
      (data: AdminUser) => {
        let retUser = data;
        if (data !== null) {
          if (data === undefined) {
            Swal.fire('Error', 'Error in saving User', 'error');
          }
          else {
            if (retUser.userId !== null) {
              Swal.fire('Submit', 'You have saved user ' + retUser.userId + ' Succesfully!', 'success');
              delay(30000);
              window.location.reload();
            }
          }
        }

      });

  }
  /* ******************************************************************** */
  onDelete(row: any) {

    //Ask confirmation msg

    Swal.fire({
      title: 'Are you sure to delete ' + this.adminList[row].loginId + ' ?',
      text: 'You can not recuperate this User!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {

      if (response.value) {

        if (this.adminList[row].loginId != null || this.adminList[row].loginId != undefined) {

          this.userService.deleteUser(this.adminList[row].userId).subscribe(() => {
            delay(30000);
            window.location.reload();
          });

        }

      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your User is safe',
          'error'
        );
      }
    });

  }
  /* ******************************************************************** */
  startEdit(row: any) {
    this.enabledEdit[row] = true;
  }
  /* ******************************************************************** */
  addUser() {
    this.addFlag = true;
    let user: AdminUser = new AdminUser();//empty user

    this.adminList.push(user);
    this.enabledEdit[this.adminList.length - 1] = true;


  }
  /* ********************************************************************* */
  onPasswordChange() {
    //alert('Pwd change' + this.adminList[this.currentRow].userId );

    let oldPwdObj = <HTMLInputElement>(document.getElementById('current-password'));
    let oldPwd = oldPwdObj.value;

    let newPwdObj = <HTMLInputElement>(document.getElementById('new-password'));
    let newPwd = newPwdObj.value;


    let loginRequest: LoginRequest = new LoginRequest();

    loginRequest.username = this.adminList[this.currentRow].loginId;
    loginRequest.password = oldPwd;
    loginRequest.newPassword = newPwd;


    this.userService.changePwd(loginRequest).subscribe(() => {
      this.closePopup()
      //delay(30000);
      //window.location.reload();
    });

  }

  /* ********************************************************************* */

  displayStyle = "none";
  currentRow = 0;

  openPopup(row: any) {
    this.currentRow = row;
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";

    let oldPwdObj = <HTMLInputElement>(document.getElementById('current-password'));
    oldPwdObj.value = '';

    let newPwdObj = <HTMLInputElement>(document.getElementById('new-password'));
    newPwdObj.value = '';

    let confPwdObj = <HTMLInputElement>(document.getElementById('confirm-password'));
    confPwdObj.value = '';

  }

  /* **************************************************************************** */
  displayRoleStyle = "none";


  openPopupRole(row: any) {
    this.currentRow = row;

    let adminUserRoleList: AdminUserRoles[] = [];
    //let userId = this.adminList[this.currentRow].userId;

    //Get roles assigned to this user in DB
    this.displayRoleStyle = "block";

  }

  closeRolePopup() {
    this.displayRoleStyle = "none";


  }

  addRole(role: any, row: any) {
    //alert(role);
    let obj: any = (document.getElementById('role-' + row) as HTMLOptionElement);
    // let val = (document.getElementById('role-'+ row) as HTMLInputElement).value;
    let i = 0;

    if (obj.checked) {
      //if (this.selectedRoles===''){
      this.selectedRoles.push(role);
      //}
      //else{
      // this.selectedRoles = this.selectedRoles + ','  + role;
      //}
    }
    else {
      for (let i = 0; i < this.selectedRoles.length; i++) {
        if (this.selectedRoles[i] === role) {
          this.selectedRoles.splice(i, 1);
          break;
        }

      }


    }

    // alert(this.selectedRoles);


  }

  checkRoleChecked(row: any) {

    let adminUserRoleList: AdminUserRoles[] = [];
    let userId = this.adminList[this.currentRow].userId;
    let roles = this.adminList[this.currentRow].userRole;

    let rolesArray = roles?.split(',');//Roles already selected and Saved in DB

    let no = rolesArray?.length;
    // for (let i=0; i<rolesArray.length; i++){

    // }

  }

  /* ********************************************************************* */
  onRoleChange() {
    //alert('Pwd change' + this.adminList[this.currentRow].userId );
    let t1 = this.selectedItems;
    let t2 = this.currentRow;

    let adminUserRoleList: AdminUserRoles[] = [];
    let userId = this.adminList[this.currentRow].userId;

    if (this.selectedItems != undefined) {
      if (this.selectedItems.length > 0) {
        for (let i = 0; i < this.selectedItems.length; i++) {
          let x1: any = this.selectedItems[i];
          let module = x1.text;
          let adminUserRole: AdminUserRoles = new AdminUserRoles();
          adminUserRole.userId = userId;
          adminUserRole.module = module;
          adminUserRole.roles = 'CRUD';

          adminUserRoleList.push(adminUserRole);

        }
      }
    }


    this.userService.saveUserRoles(adminUserRoleList).subscribe(() => {
      this.selectedItems.length = 0;
      this.closeRolePopup();

    });

  }


}
