import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AdminUser, AdminUserRoles, NewsTracker } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { NewstrackerService } from '../../shared/services/newstracker.service';
import { faSignOut, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header2',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './header2.component.html',
  styleUrl: './header2.component.scss'
})
export class Header2Component implements OnInit{

  
  currentUser: AdminUser=new AdminUser();
  userLoginResponse:any;
  public isLoggedIn = false;
  faSignOut=faSignOut;
  faBook=faBook;
  faCog=faCog;
  logoName=environment.logoName;

  adminUserRolesList: AdminUserRoles[]=[];

  tickerNewsList: NewsTracker[]=[];

  showTicker = environment.showTicker;


  
  constructor(private cache: CacheService,
              private newsService: NewstrackerService,
              private router: Router) { }

/* ************************************************************ */    
  ngOnInit(): void {
    
    // this.currentUser.userRole='SUPER';
    // this.currentUser.loginId='FAKE';
    // this.currentUser.firstName='FirstName';

    
    let user =  sessionStorage.getItem('currentUser');

    if (typeof (user) !== 'undefined' && user !== null && user !== '') {
      this.currentUser= JSON.parse(user);
    }

    let resp = sessionStorage.getItem('UserLoginResponse');
    let token = sessionStorage.getItem('token');

    if (typeof (resp) !== 'undefined' && resp !== null && resp !== '') {
      this.userLoginResponse = JSON.parse(resp);
      this.adminUserRolesList = this.userLoginResponse.adminUserRolesList;
    }
   
    if (this.currentUser !== null && 
      typeof (token !== 'undefined' && 
      token !== null && 
      token !== '')) {
    

      this.newsService.getNewsTrackerList().subscribe((data: NewsTracker[]) => {
        if (data!=null || data !=undefined){
          this.tickerNewsList=data;
        }
        //default msg
        let newstrack=new NewsTracker();
        newstrack.newsId=1;
        newstrack.news="Welcome to EZPZ Admin Portal",
        this.tickerNewsList.push(newstrack);
      });

      //Check if this user has proper role to access the current page or not.


       if(this.checkRolesAccess()){
        this.isLoggedIn=true;
       }
       else{
        this.router.navigate(['dashboard']);  
       }

    } 
    else {
      this.isLoggedIn = false;
      this.currentUser= new AdminUser();
      this.currentUser.loginId='';
      console.log('this.cache.token:: No Token');

      //force to login
      this.router.navigate(['login']);
    }
  
  
  }

/* *********************************************************** */
checkRolesAccess(): boolean{
  //By Default retFlag is FALSE, means no ACCESS to current URL, until authorized Role found in Roles List
  let retFlag=false;
  let currentUrl = this.router.url;
  
  
  for (let i=0; i<this.adminUserRolesList.length;i++){
    let adminUserRoles: AdminUserRoles = this.adminUserRolesList[i];
    if (adminUserRoles.module==='ALL'){
      //Has Access to All modules, for Super user
      
      retFlag=true;  
      break;
    }
    else if (adminUserRoles.module==='FINANCE'){
      
      retFlag=true;  
    }
    else if (adminUserRoles.module==='HR'){
      if (currentUrl==='/home' 
        || currentUrl==='/departments'
        || currentUrl==='/storeHours'
        || currentUrl==='/salaries'
        || currentUrl==='/employees'
        || currentUrl==='/listUser'
        || currentUrl==='/addUser'
      )
      {
        retFlag=true;  
        break;
      }
      
      
    }
    else if (adminUserRoles.module==='INVENTORY'){
      
      if (currentUrl==='/products' 
        || currentUrl==='/home' 
        || currentUrl==='/departments'
        || currentUrl==='/category'
        || currentUrl==='/brands'
        || currentUrl==='/purchaseorder'
        || currentUrl==='/receiveProduct'
        || currentUrl==='/inventoryAdjustment'
        || currentUrl==='/listInvoice'
        || currentUrl==='/addInvoice'
        || currentUrl==='/supplier'
      )
      {
        retFlag=true;  
        break;
      }

    }
    else if (adminUserRoles.module==='NEWS'){
      
      if (currentUrl==='/newsTracker' || currentUrl==='/home'  )
      {
        retFlag=true;  
        break;
      }
    }
    else if (adminUserRoles.module==='ORDER'){
      
      if (currentUrl==='/order' || currentUrl==='/home' )
      {
        retFlag=true;  
        break;
      }

    }
    else if (adminUserRoles.module==='POS'){
      
      if (currentUrl==='/counterSale' || currentUrl==='/home' )
      {
        retFlag=true;  
        break;
      }
    }
    else if (adminUserRoles.module==='REPORTS'){
      
      if (currentUrl==='/qurbaniReport' || currentUrl==='/home'  )
      {
        retFlag=true;  
        break;
      }

    }

  }
 
  return retFlag;
}

/* ************************************************************ */
  signOut(){
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    this.cache.resetAllData();
    
    this.isLoggedIn=false;
    if (this.isLoggedIn) {
      //this.loginService.logOutUser(); 
      //this.serverLogout();
    }
    this.router.navigate(['login']);
  }
/* ************************************************************ */
  serverLogout() {
    //this.loginService.signout()
     // .subscribe(result => {
     //   console.log(' Logout Sucessful- forwarding to Login:: ');
     // });
  }
  /* ************************************************************ */
  help(){
    console.log('Opening Help');
  }

}
