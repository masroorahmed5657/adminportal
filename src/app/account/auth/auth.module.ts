import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


// otp module
import { NgOtpInputModule } from 'ng-otp-input';

// component
// import { SignUpComponent } from './sign-up/sign-up.component';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { CreatePasswordComponent } from './create-password/create-password.component';
// import { SuccessMsgComponent } from './success-msg/success-msg.component';
// import { TwostepComponent } from './twostep/twostep.component';

// module
import { AuthRoutingModule } from './auth-routing.module';
// import { LogoutComponent } from './logout/logout.component';
// import { Page404Component } from './page404/page404.component';
// import { Page500Component } from './page500/page500.component';
// import { SignInComponent } from './sign-in/sign-in.component';


@NgModule({
  declarations: [
    // SignUpComponent,
    // ResetPasswordComponent,
    // CreatePasswordComponent,
    // SuccessMsgComponent,
    // TwostepComponent,
    // LogoutComponent,
    // Page404Component,
    // Page500Component,
    // SignInComponent,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule
  ]
})
export class AuthModule { }
