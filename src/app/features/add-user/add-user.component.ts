import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminUser } from '../../shared/models/model-classes.model';
import { UseraddService } from "../../shared/services/user-add.service";
import Swal from 'sweetalert2';
import { FooterComponent } from "../../layouts/footer/footer.component";
import { Header2Component } from "../header2/header2.component";

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, FooterComponent, Header2Component],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  bsnsFlag: any;

  constructor(
    private userService: UseraddService

  ) { }

  ngOnInit(): void {

    this.onUserSave();

  }

  userForm: FormGroup = new FormGroup({

    loginId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    userRole: new FormControl(''),
    loginPassword: new FormControl(),
    email: new FormControl('', [Validators.required]),

  });

  submitted = false;

  onUserSave() {
    let user = new AdminUser();
    // user = this.convertuserFormToVar(user);

    this.submitted = true;

    let invalidFlag = false;//default
    if (this.userForm.valid) {

      //Now check for hidden column validation. such as custName, this will be exception
      //bsnsFlag is checked and it is true, WE MUST HAVE VALUES IN BOTH FIELDS
      //Now form is VALID and ready for save

      let user = new AdminUser();
      user = this.convertuserFormToVar();

      this.userService.saveUser(user).subscribe(
        (data: AdminUser) => {
          let retUser = data;
          if (data !== null) {
            if (data === undefined) {
              Swal.fire('Error', 'Error in saving User', 'error');
            }
            else {
              if (retUser.userId !== null) {
                Swal.fire('Submit', 'You have saved user ' + retUser.userId + ' Succesfully!', 'success')
              }
            }
          }

        });
    }

  }//method
  /* ******************************************* */

  convertuserFormToVar() {
    let user = new AdminUser();
    user.email = this.userForm.get('email')?.value;
    user.firstName = this.userForm.get('firstName')?.value;
    user.lastName = this.userForm.get('lastName')?.value;
    user.loginId = this.userForm.get('loginId')?.value;
    user.loginPassword = this.userForm.get('loginPassword')?.value;
    user.userRole = this.userForm.get('userRole')?.value;

    console.log('user');
    return user;

  }
  alertWithSuccess(userId: number) {
    throw new Error('Method not implemented.');
  }

  onClear() {
    this.userForm.reset();
  }


}
