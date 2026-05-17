import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { CreatePasswordComponent } from './create-password/create-password.component';

// // component
// import { SignUpComponent } from './sign-up/sign-up.component';
// import { SuccessMsgComponent } from './success-msg/success-msg.component';
// import { TwostepComponent } from './twostep/twostep.component';
// import { LogoutComponent } from './logout/logout.component';
// import { Page404Component } from './page404/page404.component';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { Page500Component } from './page500/page500.component';
// import { SignInComponent } from './sign-in/sign-in.component';



const routes: Routes = [
  // {
  //   path: 'sign-in',
  //   component: SignInComponent
  // },
  // {
  //   path: 'sign-up',
  //   component: SignUpComponent
  // },
  // {
  //   path: 'reset-password',
  //   component: ResetPasswordComponent
  // },
  // {
  //   path: 'create-password',
  //   component: CreatePasswordComponent
  // },
  // {
  //   path: 'success-msg',
  //   component: SuccessMsgComponent
  // },
  // {
  //   path: 'twostep',
  //   component: TwostepComponent
  // },
  // {
  //   path: 'logout',
  //   component: LogoutComponent
  // },
  // {
  //   path: 'page404',
  //   component: Page404Component
  // },
  // {
  //   path: 'page500',
  //   component: Page500Component
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
