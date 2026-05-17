import { Component, OnInit } from '@angular/core';
import { faLinkedin, faInstagram, faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faHome, faUndo, faSave, faCoffee, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { AdminUser } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { environment } from '../../../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FontAwesomeModule, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  projectName = environment.appName;
  faCoffee = faCoffee;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  faSignIn = faSignIn;
  faUndo = faUndo;
  faSave = faSave;
  faHome = faHome;
  password: string = '';
  showPassword: boolean = false;

  registerFlag?: boolean;

  form!: FormGroup;
  loading = false;
  submitted = false;

  // Remember Me checkbox
  rememberMe: boolean = false;

  rememberChange() {

    this.rememberMe = !this.rememberMe

  }

  //Define all forms
  registerForm: FormGroup = new FormGroup({
    loginId: new FormControl('', Validators.required),
    loginPassword: new FormControl('', Validators.required),
    email: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    userRole: new FormControl()
  });

  errorMsg!: string;
  versionNumber = environment.versionNumber;
  appEnv = environment.appEnv;
  logoName = environment.logoName;
  background = environment.background;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private cache: CacheService
  ) { }

  // ngOnInit() {
  //   this.cache.resetAllData();


  //   // Check agar pehle se user remember h
  //   const savedUser = localStorage.getItem('currentUser');
  //   const savedToken = localStorage.getItem('Token');

  //   if (savedUser && savedToken) {
  //     this.router.navigate(['/layout/home']);
  //   }
  // }

  ngOnInit() {
    this.cache.resetAllData();

    const savedLoginId = localStorage.getItem('rememberedLoginId');
    const savedPassword = localStorage.getItem('rememberedPassword');

    if (savedLoginId) {
      this.registerForm.patchValue({
        loginId: savedLoginId,
        loginPassword: savedPassword || ''  // password blank bhi ho sakta hai
      });
      this.rememberMe = true;
    }
  }




  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordType() {
    return this.showPassword ? 'text' : 'password';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  register() {
    this.registerFlag = true;
  }

  onRegisterSave() {
    this.registerFlag = true;

    let adminUser = new AdminUser();
    this.convertFormToVar(adminUser);
    adminUser.userRole = 'USER';

    this.loginService.registerUser(adminUser)
      .subscribe(data => {
        if (data && data.userId) {
          this.alertWithSuccess(data.userId);
          this.registerFlag = false;
        }
      });
  }

  alertWithSuccess(userId: any) {
    Swal.fire('Submit', `You have succesfully registered with ${this.projectName}!`, 'success')
  }

  alertWithSignin(loginId: any) {

    Swal.fire({title:'SignIn-' + loginId, timer:1000, text:`You have succesfully signed In with ${this.projectName}!`, icon:'success'});

   // Swal.fire('SignIn-' + loginId, `You have succesfully signed In with ${this.projectName}!`, 'success')
  }

  onClear() {
    this.registerForm.reset();
  }

  // signInClick(event: Event) {
  //   event.preventDefault(); // page refresh stop

  //   if (this.registerForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;
  //   this.errorMsg = '';

  //   let adminUser = new AdminUser();
  //   adminUser = this.convertFormToVar(adminUser);

  //   this.loginService.authenticate(adminUser.loginId, adminUser.loginPassword).subscribe({
  //     next: (data) => {
  //       if (data && data.authenticated && data.adminUser && data.token !== '_EMPTY') {

  //         if (this.rememberMe) {
  //           // Remember Me checked → LocalStorage
  //           localStorage.setItem('currentUser', JSON.stringify(data.adminUser));
  //           localStorage.setItem('Token', data.token);
  //           localStorage.setItem('UserLoginResponse', JSON.stringify(data));
  //         } else {
  //           // Normal login → SessionStorage
  //           sessionStorage.setItem('currentUser', JSON.stringify(data.adminUser));
  //           sessionStorage.setItem('Token', data.token);
  //           sessionStorage.setItem('UserLoginResponse', JSON.stringify(data));
  //         }

  //         this.alertWithSignin(data.adminUser?.loginId);
  //         this.router.navigate(['/layout/home']);
  //       } else {
  //         this.errorMsg = 'Username or password is incorrect';
  //       }
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.errorMsg = 'Something went wrong, try again!';
  //       this.loading = false;
  //     }
  //   });
  // }


  signInClick(event: Event) {
    event.preventDefault();

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    let adminUser = new AdminUser();
    adminUser = this.convertFormToVar(adminUser);

    this.loginService.authenticate(adminUser.loginId, adminUser.loginPassword).subscribe({

      
      
      next: (data) => {
        console.log("Saving to localStorage:", adminUser.loginId, adminUser.loginPassword);
        if (data && data.authenticated && data.adminUser && data.token !== '_EMPTY') {

          this.playAudio();
          // Remember me functionality
          if (this.rememberMe) {
            localStorage.setItem('rememberedLoginId', adminUser.loginId);
            localStorage.setItem('rememberedPassword', adminUser.loginPassword);
          } else {
            localStorage.removeItem('rememberedLoginId');
            localStorage.removeItem('rememberedPassword');
          }

          // Always save session in sessionStorage
          sessionStorage.setItem('currentUser', JSON.stringify(data.adminUser));
          sessionStorage.setItem('Token', data.token);
          sessionStorage.setItem('UserLoginResponse', JSON.stringify(data));

          if (data.adminUser?.loginId==='foody' ||
            data.adminUser?.loginId==='paint' ||
            data.adminUser?.loginId==='fashion' ||
            data.adminUser?.loginId==='electronics' ||
            data.adminUser?.loginId==='mart' 
          ){
            this.projectName = 'TECHMACI';
          }

          this.alertWithSignin(data.adminUser?.loginId);
          this.router.navigate(['/layout/products']);
        } 
        else 
          {
          if (data.authMessage){
            this.errorMsg = data.authMessage;  
          }
          else{
            this.errorMsg = 'Username or password is incorrect';
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Something went wrong, try again!';
        this.loading = false;
      }
    });
  }




  convertFormToVar(adminUser: AdminUser) {
    adminUser.loginId = this.registerForm.get('loginId')?.value;
    adminUser.loginPassword = this.registerForm.get('loginPassword')?.value;
    if (this.registerFlag) {
      adminUser.email = this.registerForm.get('email')?.value;
      adminUser.firstName = this.registerForm.get('firstName')?.value;
      adminUser.lastName = this.registerForm.get('lastName')?.value;
    }
    return adminUser;
  }


  playAudio() {
    let audio = new Audio();

    audio.src = "../../assets/audio/assalamu_alaikum.mp3"
    audio.load();
    audio.play();
    
    let audio2 = new Audio();
    audio2.src = "../../assets/audio/play.mp3"
    audio2.load();
    audio2.play();


  }

}
