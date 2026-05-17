import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//table
import { TableModule } from 'primeng/table';
// module
import { AccountRoutingModule } from './account-routing.module';

// Component
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [    
    //LoginComponent,
    RegisterComponent
],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule

  ]
})
export class AccountModule { }
