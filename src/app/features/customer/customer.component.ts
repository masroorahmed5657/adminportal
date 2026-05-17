import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { LoginService } from '../../account/services/login.service';
import { Customer, CustomerCountryWrapper, Category, CodeMaster, Country, StateProvince, City, CountryStateProvince, CustomerRequest } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CustomerService } from '../../shared/services/customer.service';
import { faHome, faUndo, faSave, faCoffee, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faCog, faDashboard, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { faInfo, faEllipsisV, faPrint, faNewspaper, faBell, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-customer',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})

export class CustomerComponent implements OnInit {

  showAddFlag=false;
  editMode = false;

  p: number = 1;
  searchTerm: string = '';
  faCoffee = faCoffee;
  sendSmsFlag: boolean = false;
  sendEmailFlag: boolean = false;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  faSignIn = faSignIn;
  faUndo = faUndo;
  faSave = faSave;
  faHome = faHome;
  contactMethod: any;
  faDashboard = faDashboard;
  faToolbox = faToolbox;
  faCog = faCog;
  faEdit = faEdit;
  faPlusCircle = faPlusCircle;
  faHistory = faHistory;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faShoppingCart = faShoppingCart;
  faSort = faSort;
  faSearch = faSearch;
  faBell = faBell;
  faNewspaper = faNewspaper;
  faPrint = faPrint;
  faEllipsisV = faEllipsisV;
  faInfo = faInfo;
  conactedselect: any;
  add = false;
  navigateFlag = true;
  submitted = false;
  registerFlag = false;
  errorMsg = '';
  bsnsFlag = false;
  error: string = '';
  showDiv: boolean = false;
  showDiv1: boolean = false;
  dynamicData: string = 'Dynamic Placeholder';
  bestwayToContact: any;
  customerFlag = false;

  //Define all forms
  customerForm: FormGroup = new FormGroup({
    loginId: new FormControl(''),
    loginPassword: new FormControl(),
    custId: new FormControl(),
    custName: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    businessFlag: new FormControl(false),
    addressId: new FormControl(),
    email: new FormControl('', [Validators.required]),
    custType: new FormControl(),
    phone1: new FormControl('', [Validators.required]),
    phone2: new FormControl(),
    custPic: new FormControl(),
    profession: new FormControl('C'),
    priority: new FormControl(),
    bestWay: new FormControl(''),
    bestTime: new FormControl(),
    sendSmsFlag: new FormControl(),
    sendEmailFlag: new FormControl(),
    address: new FormControl(''),
    city: new FormControl(''),
    stateProvince: new FormControl(''),
    country: new FormControl('Pakistan'),
    postalCode: new FormControl(),
    salesRep: new FormControl('1'),
    billingAddress: new FormControl(),
    billingCity: new FormControl(''),
    billingStateProvince: new FormControl(''),
    billingCountry: new FormControl(''),
    billingPostalCode: new FormControl(),
    discountAmount: new FormControl(),
    discountPercentage: new FormControl()

  });

  customer: Customer = new Customer();
  customershow: any;


  customerList: Customer[] = [];
  customerCountryList: CustomerCountryWrapper[] = [];
  categoryList: Category[] = [];
  bestWayToContactList: CodeMaster[] = [{ code: 'TEXT', description: 'TEXT' }, { code: 'EMAIL', description: 'EMAIL' }, { code: 'PHONE', description: 'PHONE' }];
  bestTimeToContactList: CodeMaster[] = [{ code: 'MORNING', description: 'MORNING' }, { code: 'AFTERNOON', description: 'AFTERNOON' },
  { code: 'EVENING', description: 'EVENING' }, { code: 'NIGHT', description: 'NIGHT' }];
  countryList: Country[] = [];
  provinceList: StateProvince[] = [];
  provinceBillingList: StateProvince[] = [];
  citiesList: City[] = [];
  provinceMasterList: CountryStateProvince[] = [];
  signInUser: any = '';
  title = 'Registration';
  editFlag = false;
  selectedCountry: any = 'USA';
  /* ******************************************* */
  constructor(private customerService: CustomerService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cache: CacheService,
    private loginService: LoginService) { }

  ngOnInit(): void {

this.customerForm = this.fb.group({

      custName: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.email],

      custType: ['REGULAR'],
      businessFlag: [false],

      phone1: [''],
      phone2: [''],

      profession: [''],
      priority: [0],

      bestWay: [''],
      bestTime: [''],

      sendSmsFlag: [false],
      sendEmailFlag: [true],

      loginId: [''],
      loginPassword: [''],

      subsPayment: [0],
      subsPlan: ['Y'],

      address: [''],
      city: [''],
      stateProvince: [''],
      country: ['Pakistan'],
      postalCode: [''],

      paymentMethod: ['PAYPAL'],

      billingAddress: [''],
      billingCity: [''],
      billingStateProvince: [''],
      billingCountry: ['Pakistan'],
      billingPostalCode: [''],

      discountPercentage: [0],
      discountAmount: [0]
    });

    

    this.customerService.getAllCustomers().subscribe((data: Customer[]) => {
      this.customerList = data.reverse();
    });
    //this.customerForm.get('loginId')?.setValue(null);
    //this.customerForm.get('loginPassword')?.setValue(null);



    let user = sessionStorage.getItem('currentUser');
    if (typeof (user) !== 'undefined' && user !== null && user !== '') {
      // this.customer = JSON.parse(user);
      // this.convertToForm(this.customer);


      // this.customerService.getCountryList().subscribe(data => {
      //   this.countryList = data;
      //  });

      //  this.selectedCountry = this.customer.country;

      //  this.customerService.getProvinceCityList(this.selectedCountry).subscribe(data=> {
      //    this.provinceList = data;
      //    });





      this.customerService.getCountryList().subscribe((data: Country[]) => {
        this.countryList = data;
      });

      //this.selectedCountry = this.customer.country;

      this.customerService.getProvinceList().subscribe((data: StateProvince[]) => {

        this.provinceList = data;
        this.provinceBillingList = data

      });


      // this.customerService.getProvinceList().subscribe((data: StateProvince[]) => {
      //   this.provinceList = data;
      // });



    }

    window.scrollTo(0, 0);
    this.customerForm.reset();
    this.customerService.getCountryList().subscribe(data => {
      this.countryList = data;
    });

    this.customerForm.get('salesRep')?.setValue(true);
    this.customerForm.get('sendEmailFlag')?.setValue('true');



    // this.provinceList = [{"name":"Alabama","code":"AL"},{"name":"Alaska","code":"AK"},{"name":"Arizona","code":"AZ"},{"name":"Arkansas","code":"AR"},{"name":"California","code":"CA"},{"name":"Colorado","code":"CO"},{"name":"Connecticut","code":"CT"},{"name":"Delaware","code":"DE"},{"name":"Florida","code":"FL"},{"name":"Georgia","code":"GA"},{"name":"Hawaii","code":"HI"},{"name":"Idaho","code":"ID"},{"name":"Illinois","code":"IL"},{"name":"Indiana","code":"IN"},{"name":"Iowa","code":"IA"},{"name":"Kansas","code":"KS"},{"name":"Kentucky","code":"KY"},{"name":"Louisiana","code":"LA"},{"name":"Maine","code":"ME"},{"name":"Maryland","code":"MD"},{"name":"Massachusetts","code":"MA"},{"name":"Michigan","code":"MI"},{"name":"Minnesota","code":"MN"},{"name":"Mississippi","code":"MS"},{"name":"Missouri","code":"MO"},{"name":"Montana","code":"MT"},{"name":"Nebraska","code":"NE"},{"name":"Nevada","code":"NV"},{"name":"New Hampshire","code":"NH"},{"name":"New Jersey","code":"NJ"},{"name":"New Mexico","code":"NM"},{"name":"New York","code":"NY"},{"name":"North Carolina","code":"NC"},{"name":"North Dakota","code":"ND"},{"name":"Ohio","code":"OH"},{"name":"Oklahoma","code":"OK"},{"name":"Oregon","code":"OR"},{"name":"Pennsylvania","code":"PA"},{"name":"Rhode Island","code":"RI"},{"name":"South Carolina","code":"SC"},{"name":"South Dakota","code":"SD"},{"name":"Tennessee","code":"TN"},{"name":"Texas","code":"TX"},{"name":"Utah","code":"UT"},{"name":"Vermont","code":"VT"},{"name":"Virginia","code":"VA"},{"name":"Washington","code":"WA"},{"name":"West Virginia","code":"WV"},{"name":"Wisconsin","code":"WI"},{"name":"Wyoming","code":"WY"}];

    let source = this.activateRoute.snapshot.paramMap.get('source');
    if (source === 'EDIT') {
      this.title = 'Edit Profile';
      this.editFlag = true;
      //Get customer details from sessionStorage
      let user = sessionStorage.getItem('currentUser');

      if (typeof (user) !== 'undefined' && user !== null && user !== '') {
        let customer = JSON.parse(user);
        this.convertToForm(customer);

        this.selectedCountry = customer.country;

        this.customerService.getProvinceCityList(this.selectedCountry).subscribe(data => {
          this.provinceList = data;
        });

      }
    }
    else {
      this.title = 'Registration';
      this.editFlag = false;
      this.customerForm.reset();

    }


  }
  /* ************************************************************ */
  get f(): { [key: string]: AbstractControl } {
    return this.customerForm.controls;
  }

  /* ************************************************************ */
  // onCustomerSave(source: any) {
  //   if (this.customerForm.invalid) {
  //     //Return without save if form is not valid
  //     return;
  //   }

  //   let customer = new Customer();
  //   customer = this.convertCustFormToVar(customer);
  //   //address = this.convertAddressFormToVar(address);
  //   this.submitted = true;
  //   let invalidFlag = false;//default
  //   // invalidFlag=true; //if form is Invalid, make it true
  //   // //Now check for hidden column validation. such as custName, this will be exception

  //   // if (this.customerForm.get('firstName')?.status === 'INVALID' ||
  //   //           this.customerForm.get('lastName')?.status === 'INVALID'   ||
  //   //           this.customerForm.get('phone1')?.status === 'INVALID'   ||
  //   //           this.customerForm.get('email')?.status === 'INVALID'   ||
  //   //           this.customerForm.get('address1')?.status === 'INVALID'   ||
  //   //           this.customerForm.get('country')?.status === 'INVALID'   ||
  //   //           this.customerForm.get('stateProvince')?.status === 'INVALID'   ||
  //   //           this.customerForm.get('city')?.status === 'INVALID'
  //   //           ){

  //   //     invalidFlag=true;
  //   //   }
  //   //   else{
  //   //     invalidFlag=false;
  //   //   }

  //   //
  //   // if (invalidFlag){
  //   //   return;
  //   // }


  //   //if (!invalidFlag){
  //   //Now set dome default values
  //   if (source === 'EDIT') {
  //     customer.custId = this.customer.custId;
  //     customer.custType = 'C';
  //     customer.priority = 1;

  //     let customerRequest: CustomerRequest = new CustomerRequest();
  //     // customerRequest = customer;
  //     this.customerService.updateCustomer(customerRequest).subscribe(data => {
  //       let userData = data;
  //       if (data !== undefined) {
  //         if (data >= 0) {
  //           this.signInUser = customer.firstName;
  //           sessionStorage.setItem('signInUser', this.signInUser);
  //           //now replace data in session
  //           sessionStorage.setItem('currentUser', JSON.stringify(customer));
  //           Swal.fire('Submit', 'You have succesfully saved the profile!', 'success')
  //           this.home();
  //         }
  //       }
  //     });

  //   }
  //   else {
  //     customer.custType = 'C';
  //     customer.priority = 1;

  //     let customerRequest: CustomerRequest = new CustomerRequest();
  //     //  customerRequest = customer;
  //     this.customerService.saveCustomer(customerRequest).subscribe(data => {
  //       let userData = data;
  //       if (data !== undefined) {
  //         let customer = data.customer;
  //         if (customer.custId !== null) {
  //           this.signInUser = customer.firstName;
  //           sessionStorage.setItem('signInUser', this.signInUser);
  //           sessionStorage.setItem('currentUser', JSON.stringify(customer));
  //           this.alertWithSuccess(customer.custId);
  //           delay(30000);
  //           this.cache.set('reload', 'F');
  //           this.router.navigate(['/']);
  //         }
  //       }
  //     });

  //   }

  // }


  onCustomerSave(source: any, customer: Customer) {
    this.submitted = true;

    // if (this.customerForm.invalid) {
    //   return; // form invalid hai to save mat karo
    // }


    if (source === 'EDIT') {
      customer.custId = customer.custId;

      this.customerService.updateCustomer(customer).subscribe(data => {
        if (data !== undefined && data >= 0) {
          this.signInUser = customer.firstName;
          //sessionStorage.setItem('signInUser', this.signInUser);
          //sessionStorage.setItem('currentUser', JSON.stringify(customer));
          Swal.fire('Submit', 'You have succesfully saved the profile!', 'success');
          this.showAddFlag=false;
          this.editFlag=false;
          this.editMode=false;
          // this.home();
        }
      });

    } else {
      this.customerService.saveCustomer(customer).subscribe(data => {
        if (data && data.customer && data.customer.custId) {
          let customerRes = data.customer;
          this.signInUser = customerRes.firstName;
          //sessionStorage.setItem('signInUser', this.signInUser);
          //sessionStorage.setItem('currentUser', JSON.stringify(customerRes));
          this.alertWithSuccess(customerRes.custId);
          this.showAddFlag=false;
          this.editFlag=false;
          this.editMode=false;

          this.cache.set('reload', 'F');
          // this.router.navigate(['/']);
        }
      });
    }
  }



  /* ************************************************************** */

  convertToForm(customer: Customer) {
    this.customerForm.get('loginId')?.setValue(customer.loginId);
    this.customerForm.get('loginPassword')?.setValue(customer.loginPassword);
    this.customerForm.get('firstName')?.setValue(customer.firstName);
    this.customerForm.get('lastName')?.setValue(customer.lastName);
    this.customerForm.get('email')?.setValue(customer.email);
    this.customerForm.get('phone1')?.setValue(customer.phone1);
    this.customerForm.get('address1')?.setValue(customer.address);
    this.customerForm.get('city')?.setValue(customer.city);
    this.customerForm.get('stateProvince')?.setValue(customer.stateProvince);
    this.customerForm.get('country')?.setValue(customer.country);
    this.customerForm.get('postalCode')?.setValue(customer.postalCode);
    this.customerForm.get('profession')?.setValue(customer.profession);
    this.customerForm.get('salesRep')?.setValue(customer.salesRep);
    this.customerForm.get('businessFlag')?.setValue(customer.businessFlag);

    this.customerForm.get('billingAddress')?.setValue(customer.billingAddress);
    this.customerForm.get('billingCity')?.setValue(customer.billingCity);
    this.customerForm.get('billingStateProvince')?.setValue(customer.billingStateProvince);
    this.customerForm.get('billingCountry')?.setValue(customer.billingCountry);
    this.customerForm.get('billingPostalCode')?.setValue(customer.billingPostalCode);


  }


  /****************************************** */
  updateFlags(contactMethod: any, customer: Customer) {
    customer.sendEmailFlag = false;
    customer.sendSmsFlag = false;

    if (contactMethod === 'sendSmsFlag') {
      customer.sendSmsFlag = true;
    }
    else if (contactMethod === 'sendEmailFlag') {
      customer.sendEmailFlag = true;
    }
    else if (contactMethod === 'businessFlag') {
      customer.businessFlag = true;
    }
  }





  /******************************************* */



  /* ******************************************* */
  convertCustFormToVar(customer: Customer) {
    customer.custId = this.customerForm.get('custId')?.value;
    customer.discountAmount = this.customerForm.get('discountAmount')?.value;
    customer.discountPercentage = this.customerForm.get('discountPercentage')?.value;

    customer.loginId = this.customerForm.get('loginId')?.value;
    customer.loginPassword = this.customerForm.get('loginPassword')?.value;
    customer.custName = this.customerForm.get('custName')?.value;
    customer.firstName = this.customerForm.get('firstName')?.value;
    this.signInUser = customer.firstName;
    customer.lastName = this.customerForm.get('lastName')?.value;
    customer.email = this.customerForm.get('email')?.value;
    customer.loginId = customer.email//Important
    customer.custName = customer.email//Important
    customer.businessFlag = this.customerForm.get('businessFlag')?.value;
    customer.phone1 = this.customerForm.get('phone1')?.value;
    customer.phone2 = this.customerForm.get('phone2')?.value;
    customer.profession = this.customerForm.get('profession')?.value;

    customer.bestTime = this.customerForm.get('bestTime')?.value;
    customer.address = this.customerForm.get('address1')?.value;
    customer.city = this.customerForm.get('city')?.value;
    customer.stateProvince = this.customerForm.get('stateProvince')?.value;
    customer.country = this.customerForm.get('country')?.value;
    customer.postalCode = this.customerForm.get('postalCode')?.value;
    customer.salesRep = this.customerForm.get('salesRep')?.value;

    customer.sendSmsFlag = this.customerForm.get('sendSmsFlag')?.value;
    customer.sendEmailFlag = this.customerForm.get('sendEmailFlag')?.value;


    customer.bestWay = this.bestwayToContact;


    if (customer.sendSmsFlag === null) {
      customer.sendSmsFlag = false;
    }

    if (customer.sendEmailFlag === null) {
      customer.sendEmailFlag = false;
    }

    if (customer.salesRep === null) {
      customer.salesRep = false;
    }

    customer.billingAddress = this.customerForm.get('billingAddress')?.value;
    customer.billingCity = this.customerForm.get('billingCity')?.value;
    customer.billingStateProvince = this.customerForm.get('billingStateProvince')?.value;
    customer.billingCountry = this.customerForm.get('billingCountry')?.value;
    customer.billingPostalCode = this.customerForm.get('billingPostalCode')?.value;



    return customer;
  }
  /* ******************************************* */

  alertWithSuccess(userId: any) {
    Swal.fire('Submit', 'You have successfully registered as a customer', 'success')
  }

  /* ****************************************** */
  onClear() {
    this.customerForm.reset();
  }


  /* ******************* FOOTER Links/Methods ********************* */
  // home() {
  //   this.router.navigate(['home']);
  // }

  infoClick() {
    this.router.navigate(['info']);
  }

  reportClick() {
    this.router.navigate(['report']);
  }

  settingClick() {
    this.router.navigate(['settings']);
  }
  notificationClick() {
    this.router.navigate(['notification']);
  }

  onBsnsChk() {
    this.bsnsFlag = this.customerForm.get('businessFlag')?.value;
    if (!this.bsnsFlag) {
      this.bsnsFlag = true;
    }
    else {
      this.bsnsFlag = false;
    }
  }



  onCountryChange() {

    const selectedCountry = this.customerForm.get('country')?.value;

    // this.customerForm.get('state')?.setValue(''); // Reset state when country changes
    // this.customerForm.get('city')?.setValue(''); // Reset city when country changes

    if (selectedCountry) {
      this.customerService.getProvinceCityList(selectedCountry).subscribe(data => {
        this.provinceList = data;
      });

    }
  }

  // api code

  onStateChange() {
    const selectedState = this.customerForm.get('stateProvince')?.value;
    // this.customerForm.get('city')?.setValue(''); // Reset city when state changes


    if (selectedState) {
      this.customerService.getCityList(selectedState).subscribe(data => {
        this.citiesList = data;


      });
    }
  }


  toggleDiv() {

    this.showDiv = !this.showDiv;

  }

  toggleDiv1() {

    this.showDiv1 = !this.showDiv1;

  }


  onCountryChangeBilling() {

    const billingCountry = this.customerForm.get('billingCountry')?.value;

    // this.customerForm.get('state')?.setValue(''); // Reset state when country changes
    // this.customerForm.get('city')?.setValue(''); // Reset city when country changes

    if (billingCountry) {
      this.customerService.getProvinceCityList(billingCountry).subscribe(data => {
        this.provinceBillingList = data;
      });

    }
  }

  onDelete() {

    //Ask confirmation msg

    Swal.fire({
      title: 'Are you sure to delete ',
      text: 'You can not recuperate this Customer!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {

      if (response.value) {


        let custId: any = this.customerList;
        // this.customerService.deleteCustomer(custId).subscribe(()=>{
        //   delay(30000);
        //   window.location.reload();
        // });



      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Customer file is safe',
          'error'
        );
      }
    });
  }


  // showCustomer() {
  //   if (this.signInUser !== 'SignIn') {
  //     this.add = true;
  //   }
  //   else {
  //     this.navigateFlag = false;
  //   }
  // }


  get filteredItems() {
    return this.customerList.filter(customer =>
      customer.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


save(){
  if (this.editMode){
    // let customer = new Customer();
    // customer = this.convertCustFormToVar(customer);
    // customer.custType = 'C';
    // customer.priority = 1;
    this.onCustomerSave('EDIT', this.customer);
  }
  else{
    let customer = new Customer();
    customer = this.convertCustFormToVar(customer);
    customer.custType = 'C';
    customer.priority = 1;

    this.onCustomerSave('ADD', customer);
  }


}

 editCustomer(customer: Customer): void {
  this.editFlag=true;
  this.editMode=true;
  this.showAddFlag=true;
  this.customer = customer;
  if (this.customer.country===null || this.customer.country===undefined){
    this.customer.country = 'Pakistan';
  }
  //this.customerForm.patchValue(customer);
   // this.router.navigate(['/customers/edit', id]);
  }

 addCustomer(): void {
  this.showAddFlag=true;
   // this.router.navigate(['/customers/add']);
  }

  goToList(){
    this.editFlag=false;
    this.showAddFlag=false;
    this.editMode = false;
  }

}

