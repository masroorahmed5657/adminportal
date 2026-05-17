import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AdminUser, AdminUserRoles, Country, StateProvince, BarcodeResponse } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CustomerService } from '../../shared/services/customer.service';
import { ProductsService } from '../../shared/services/products.service';
import { faSignOut, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from "../../layouts/footer/footer.component";
import { Header2Component } from "../header2/header2.component";
import { CommonModule } from '@angular/common';
import { BarcodesService } from '../../shared/services/barcodes.service';


@Component({
  selector: 'app-home2',
  imports: [FooterComponent, Header2Component,CommonModule,RouterModule],
  templateUrl: './home2.component.html',
  styleUrl: './home2.component.scss'
})
export class Home2Component implements OnInit {

  currentUser: AdminUser = new AdminUser();
  userLoginResponse: any;
  public isLoggedIn = false;
  faSignOut = faSignOut;
  faBook = faBook;
  faCog = faCog;
  adminUserRolesList: AdminUserRoles[] = [];
  countryList: Country[] = [];
  provinceList: StateProvince[] = [];
  orderFlag = false;
  posFlag = false;
  reportsFlag = false;
  inventoryFlag = false;
  financeFlag = false;
  hrFlag = false;
  newsAlertFlag = false;
  warehouseFlag = false;
  appName = environment.appName;

  constructor(
    private customerService: CustomerService,
    private cache: CacheService,
    private router: Router,
    private barcodeService: BarcodesService,
    private productService: ProductsService) { }

  ngOnInit(): void {

    let user = sessionStorage.getItem('currentUser');

    if (typeof (user) !== 'undefined' && user !== null && user !== '') {
      this.currentUser = JSON.parse(user);
    }


    let token = sessionStorage.getItem('token');
    let resp = sessionStorage.getItem('UserLoginResponse');
    if (typeof (resp) !== 'undefined' && resp !== null && resp !== '') {
      this.userLoginResponse = JSON.parse(resp);
      this.adminUserRolesList = this.userLoginResponse.adminUserRolesList;
    }


    if (this.currentUser !== null &&
      typeof (token !== 'undefined' &&
        token !== null &&
        token !== '')) {

      this.countryList = this.cache.getList('countryList');
      if (!this.countryList) {
        this.customerService.getCountryList().subscribe(data => {
          this.countryList = data;
          if (this.countryList !== undefined) {
            this.cache.setList('countryList', this.countryList);
          }

        });

      }


      this.provinceList = this.cache.getList('provinceList');
      if (!this.countryList) {
        this.customerService.getProvinceList().subscribe(data => {
          this.provinceList = data;
          if (this.provinceList !== undefined) {
            this.cache.setList('provinceList', this.provinceList);
          }

        });

      }

      this.checkRolesAccess();

    }
    else {
      this.isLoggedIn = false;
      this.currentUser = new AdminUser();
      this.currentUser.loginId = '';
      console.log('this.cache.token:: No Token');

      //force to login
      this.router.navigate(['login']);
    }


  }

  /* *********************************************************** */
  checkRolesAccess(): boolean {
    //By Default retFlag is FALSE, means no ACCESS to current URL, until authorized Role found in Roles List
    let retFlag = false;
    let currentUrl = this.router.url;

    for (let i = 0; i < this.adminUserRolesList.length; i++) {
      let adminUserRoles: AdminUserRoles = this.adminUserRolesList[i];
      if (adminUserRoles.module === 'ALL') {
        //Has Access to All modules, for Super user
        retFlag = true;
        break;
      }
      else if (adminUserRoles.module === 'ORDER') {
        this.orderFlag = true;
      }
      else if (adminUserRoles.module === 'POS') {
        this.posFlag = true;
      }
      else if (adminUserRoles.module === 'REPORTS') {
        this.reportsFlag = true;
      }
      else if (adminUserRoles.module === 'INVENTORY') {
        this.inventoryFlag = true;
      }
      else if (adminUserRoles.module === 'FINANCE') {
        this.financeFlag = true;
      }
      else if (adminUserRoles.module === 'HR') {
        this.hrFlag = true;
      }
      else if (adminUserRoles.module === 'NEWS') {
        this.newsAlertFlag = true;
      }
      else if (adminUserRoles.module === 'WAREHOUSE') {
        this.warehouseFlag = true;
      }


    }

    return retFlag;
  }

  qrCodeImage: BarcodeResponse = new BarcodeResponse();

  getBarcode() {
    let barCode = '12345678901';

    this.barcodeService.getQRBarCode(barCode).subscribe((data: BarcodeResponse) => {

      this.qrCodeImage = data;
      this.qrCodeImage.imageType = 'image/png';


    });
  }


}
