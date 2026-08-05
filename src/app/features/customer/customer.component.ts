import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
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
import { NotificationService } from '../../shared/services/notification.service';
=======
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { CustomerService } from '../../shared/services/customer.service';
import {
  Customer, Country, StateProvince, City, CodeMaster
} from '../../shared/models/model-classes.model';
import {
  faCoffee, faSignIn, faUndo, faSave, faHome, faDashboard, faToolbox,
  faCog, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart,
  faSort, faSearch, faBell, faNewspaper, faPrint, faEllipsisV, faInfo
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-customer',
<<<<<<< HEAD
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
=======
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

<<<<<<< HEAD
  showAddFlag = false;
  editMode = false;

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

  /* ===== Pagination (Shopify-style Previous / Next) ===== */
  page: number = 1;
  pageSize: number = 5;

  get totalPages(): number {
    const len = this.filteredItems.length;
    return Math.max(1, Math.ceil(len / this.pageSize));
  }

  get pagedCustomerList(): Customer[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  onSearchChange() {
    this.page = 1; // reset to first page whenever search changes
  }

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
=======
  // ── UI flags ────────────────────────────────────────────────────────────────
  showAddFlag    = false;
  editMode       = false;
  isLoading      = false;
  isSaving       = false;
  showDetailModal = false;
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de

  // ── Pagination & search ─────────────────────────────────────────────────────
  p = 1;
  searchTerm = '';
  private searchDebounce: any;

  // ── Data ────────────────────────────────────────────────────────────────────
  customerList: Customer[] = [];
<<<<<<< HEAD
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
    private loginService: LoginService,
    private notify: NotificationService) { }
=======
  customer:     Customer   = new Customer();
  viewCustomer: Customer   = new Customer();   // used by view-detail modal
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de

  // ── Reactive form (kept for legacy compatibility) ───────────────────────────
  customerForm!: FormGroup;

  // ── Lookup lists ────────────────────────────────────────────────────────────
  countryList:          Country[]       = [];
  provinceList:         StateProvince[] = [];
  citiesList:           City[]          = [];
  provinceBillingList:  StateProvince[] = [];

  bestWayToContactList: CodeMaster[] = [
    { code: 'TEXT',  description: 'TEXT'  },
    { code: 'EMAIL', description: 'EMAIL' },
    { code: 'PHONE', description: 'PHONE' }
  ];
  bestTimeToContactList: CodeMaster[] = [
    { code: 'MORNING',   description: 'MORNING'   },
    { code: 'AFTERNOON', description: 'AFTERNOON' },
    { code: 'EVENING',   description: 'EVENING'   },
    { code: 'NIGHT',     description: 'NIGHT'     }
  ];

  // ── FontAwesome icons ────────────────────────────────────────────────────────
  faCoffee = faCoffee; faTwitter = faTwitter; faFacebook = faFacebook;
  faGoogle = faGoogle; faSignIn = faSignIn; faUndo = faUndo; faSave = faSave;
  faHome = faHome; faDashboard = faDashboard; faToolbox = faToolbox;
  faCog = faCog; faEdit = faEdit; faPlusCircle = faPlusCircle;
  faHistory = faHistory; faFileInvoiceDollar = faFileInvoiceDollar;
  faShoppingCart = faShoppingCart; faSort = faSort; faSearch = faSearch;
  faBell = faBell; faNewspaper = faNewspaper; faPrint = faPrint;
  faEllipsisV = faEllipsisV; faInfo = faInfo;

  // ── Legacy variables (kept for compatibility) ────────────────────────────────
  sendSmsFlag = false; sendEmailFlag = false; contactMethod: any;
  conactedselect: any; add = false; navigateFlag = true; submitted = false;
  registerFlag = false; errorMsg = ''; bsnsFlag = false; error = '';
  showDiv = false; showDiv1 = false; dynamicData = 'Dynamic Placeholder';
  bestwayToContact: any; customerFlag = false; signInUser = '';
  title = 'Registration'; editFlag = false; selectedCountry = 'Pakistan';

  // ────────────────────────────────────────────────────────────────────────────
  constructor(
    private customerService: CustomerService,
    private router:          Router,
    private activateRoute:   ActivatedRoute,
    private fb:              FormBuilder
  ) {}

  // ────────────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadCustomers();
    this.initForm();
    this.loadCountryData();
    this.checkEditMode();
  }

<<<<<<< HEAD
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
      this.page = 1; // reset to first page on fresh load
    });

    let user = sessionStorage.getItem('currentUser');
    if (typeof (user) !== 'undefined' && user !== null && user !== '') {

      this.customerService.getCountryList().subscribe((data: Country[]) => {
        this.countryList = data;
      });

      this.customerService.getProvinceList().subscribe((data: StateProvince[]) => {

        this.provinceList = data;
        this.provinceBillingList = data

      });

    }

    window.scrollTo(0, 0);
    this.customerForm.reset();
    this.customerService.getCountryList().subscribe(data => {
      this.countryList = data;
    });

    this.customerForm.get('salesRep')?.setValue(true);
    this.customerForm.get('sendEmailFlag')?.setValue('true');


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

=======
  // ── Data loading ─────────────────────────────────────────────────────────────
  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customerList = data.reverse();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load customers', 'error');
        this.isLoading = false;
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
      }
    });
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      firstName:        ['', Validators.required],
      lastName:         [''],
      email:            ['', Validators.email],
      phone1:           [''],
      phone2:           [''],
      custType:         ['REGULAR'],
      profession:       [''],
      priority:         [0],
      businessFlag:     [false],
      joiningDate:      [''],
      bestWay:          [''],
      bestTime:         [''],
      sendSmsFlag:      [false],
      sendEmailFlag:    [false],
      address:          [''],
      city:             [''],
      stateProvince:    [''],
      country:          ['Pakistan'],
      postalCode:       [''],
      billingAddress:   [''],
      billingCity:      [''],
      billingStateProvince: [''],
      billingCountry:   [''],
      billingPostalCode:[''],
      loginId:          [''],
      loginPassword:    [''],
      salesRep:         [''],
      subsPlan:         [''],
      subsExpiry:       [''],
      discountAmount:   [0],
      discountPercentage:[0]
    });
  }

  loadCountryData(): void {
    this.customerService.getCountryList().subscribe(
      (data: Country[]) => this.countryList = data
    );
    this.customerService.getProvinceList().subscribe(
      (data: StateProvince[]) => {
        this.provinceList = data;
        this.provinceBillingList = data;
      }
    );
  }

  checkEditMode(): void {
    const source = this.activateRoute.snapshot.paramMap.get('source');
    if (source === 'EDIT') {
      this.title    = 'Edit Profile';
      this.editFlag = true;
      const user = sessionStorage.getItem('currentUser');
      if (user) {
        const customer = JSON.parse(user);
        this.convertToForm(customer);
        this.selectedCountry = customer.country;
        this.customerService
          .getProvinceCityList(this.selectedCountry)
          .subscribe(data => this.provinceList = data);
      }
    } else {
      this.title    = 'Registration';
      this.editFlag = false;
      this.customerForm.reset();
    }
  }

  // ── Search with debounce ─────────────────────────────────────────────────────
  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => { this.p = 1; }, 300);
  }

  get filteredCustomers(): Customer[] {
    if (!this.searchTerm.trim()) return this.customerList;
    const term = this.searchTerm.toLowerCase();
    return this.customerList.filter(c =>
      c.firstName?.toLowerCase().includes(term)  ||
      c.lastName?.toLowerCase().includes(term)   ||
      c.custName?.toLowerCase().includes(term)   ||
      c.email?.toLowerCase().includes(term)      ||
      c.phone1?.includes(term)                   ||
      c.phone2?.includes(term)                   ||
      c.profession?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term)       ||
      c.country?.toLowerCase().includes(term)
    );
  }

  // ── Add / Edit / View ────────────────────────────────────────────────────────
  addCustomer(): void {
    this.showAddFlag = false;   // reset first to force change detection
    this.editMode    = false;
    this.customer    = new Customer();
    this.customer.country    = 'Pakistan';
    this.customer.custType   = 'REGULAR';
    this.customer.priority   = 0;
    this.customer.discountAmount     = 0;
    this.customer.discountPercentage = 0;
    this.customer.businessFlag  = false;
    this.customer.sendSmsFlag   = false;
    this.customer.sendEmailFlag = false;
    this.showAddFlag = true;
  }

  editCustomer(cust: Customer): void {
    this.showAddFlag  = true;
    this.editMode     = true;
    this.customer     = JSON.parse(JSON.stringify(cust));   // deep clone
    if (!this.customer.country) this.customer.country = 'Pakistan';
  }

  /**
   * Opens the view-detail modal for a given customer.
   */
  viewDetail(cust: Customer): void {
    this.viewCustomer   = JSON.parse(JSON.stringify(cust)); // deep clone
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
  }

  goToList(): void {
    this.showAddFlag = false;
    this.editMode    = false;
    this.customer    = new Customer();
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  save(): void {
    // Basic validation
    if (!this.customer.firstName?.trim()) {
      Swal.fire('Validation', 'First Name is required', 'warning');
      return;
    }
    if (!this.customer.email?.trim()) {
      Swal.fire('Validation', 'Email is required', 'warning');
      return;
    }
    if (!this.customer.phone1?.trim()) {
      Swal.fire('Validation', 'Phone 1 is required', 'warning');
      return;
    }

    this.isSaving = true;

<<<<<<< HEAD
  }
  /* ************************************************************ */
  get f(): { [key: string]: AbstractControl } {
    return this.customerForm.controls;
  }

  /* ************************************************************ */

  onCustomerSave(source: any, customer: Customer) {
    this.submitted = true;

    if (source === 'EDIT') {
      customer.custId = customer.custId;

      this.customerService.updateCustomer(customer).subscribe(data => {
        if (data !== undefined && data >= 0) {
          this.signInUser = customer.firstName;
          this.notify.success('You have successfully saved the profile!');
          this.showAddFlag = false;
          this.editFlag = false;
          this.editMode = false;
          // refresh list so table reflects the update
          this.customerService.getAllCustomers().subscribe((data: Customer[]) => {
            this.customerList = data.reverse();
            this.page = 1;
          });
=======
    if (this.editMode) {
      this.customerService.updateCustomer(this.customer).subscribe({
        next: () => {
          Swal.fire('Success', 'Customer updated successfully', 'success');
          this.onSaveComplete();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Update failed', 'error');
          this.isSaving = false;
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
        }
      });
    } else {
<<<<<<< HEAD
      this.customerService.saveCustomer(customer).subscribe(data => {
        if (data && data.customer && data.customer.custId) {
          let customerRes = data.customer;
          this.signInUser = customerRes.firstName;
          this.alertWithSuccess(customerRes.custId);
          this.showAddFlag = false;
          this.editFlag = false;
          this.editMode = false;

          this.cache.set('reload', 'F');
          // refresh list so table reflects the new customer
          this.customerService.getAllCustomers().subscribe((data: Customer[]) => {
            this.customerList = data.reverse();
            this.page = 1;
          });
=======
      this.customerService.saveCustomer(this.customer).subscribe({
        next: (res: any) => {
          if (res?.customer?.custId) {
            Swal.fire('Success', 'Customer added successfully', 'success');
            this.onSaveComplete();
          } else {
            throw new Error('Invalid response');
          }
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Save failed', 'error');
          this.isSaving = false;
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
        }
      });
    }
  }

<<<<<<< HEAD
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
    this.notify.success('You have successfully registered as a customer');
  }

  /* ****************************************** */
  onClear() {
    this.customerForm.reset();
  }

  /* ******************* FOOTER Links/Methods ********************* */

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

    if (selectedCountry) {
      this.customerService.getProvinceCityList(selectedCountry).subscribe(data => {
        this.provinceList = data;
      });

    }
  }

  onStateChange() {
    const selectedState = this.customerForm.get('stateProvince')?.value;

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

    if (billingCountry) {
      this.customerService.getProvinceCityList(billingCountry).subscribe(data => {
        this.provinceBillingList = data;
      });

    }
  }

  async onDelete(customer: Customer) {

    const confirmed = await this.notify.confirmDelete('this customer');
    if (!confirmed) {
      this.notify.info('Your customer file is safe');
      return;
    }

    this.customerService.deleteCustomer(customer.custId).subscribe({
      next: () => {
        const index = this.customerList.findIndex(c => c.custId === customer.custId);
        if (index > -1) {
          this.customerList.splice(index, 1);
          this.customerList = [...this.customerList];
        }

        // If we deleted the last item on the last page, step back a page
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }

        this.notify.success('Customer has been deleted.');
      },
      error: (err) => {
        console.error('Error deleting customer:', err);
        this.notify.error('Failed to delete customer');
=======
  private onSaveComplete(): void {
    this.isSaving    = false;
    this.showAddFlag = false;
    this.editMode    = false;
    this.customer    = new Customer();
    this.loadCustomers();
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  onDelete(custId: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.customerService.deleteCustomer(custId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
            this.loadCustomers();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Delete failed', 'error');
            this.isLoading = false;
          }
        });
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
      }
    });
  }

<<<<<<< HEAD
  get filteredItems() {
    return this.customerList.filter(customer =>
      customer.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  save() {
    if (this.editMode) {
      this.onCustomerSave('EDIT', this.customer);
    }
    else {
      let customer = new Customer();
      customer = this.convertCustFormToVar(customer);
      customer.custType = 'C';
      customer.priority = 1;

      this.onCustomerSave('ADD', customer);
    }
  }

  editCustomer(customer: Customer): void {
    this.editFlag = true;
    this.editMode = true;
    this.showAddFlag = true;
    this.customer = customer;
    if (this.customer.country === null || this.customer.country === undefined) {
      this.customer.country = 'Pakistan';
    }
  }

  addCustomer(): void {
    this.editMode = false;
    this.customer = new Customer();
    this.customer.country = 'Pakistan';
    this.showAddFlag = true;
  }

  goToList() {
    this.editFlag = false;
    this.showAddFlag = false;
    this.editMode = false;
  }

=======
  // ── Legacy / compatibility methods ───────────────────────────────────────────
  get f(): { [key: string]: AbstractControl } { return this.customerForm.controls; }

  convertToForm(customer: Customer): void {
    this.customerForm.patchValue({
      firstName:           customer.firstName,
      lastName:            customer.lastName,
      email:               customer.email,
      phone1:              customer.phone1,
      phone2:              customer.phone2,
      address:             customer.address,
      city:                customer.city,
      stateProvince:       customer.stateProvince,
      country:             customer.country,
      postalCode:          customer.postalCode,
      profession:          customer.profession,
      businessFlag:        customer.businessFlag,
      billingAddress:      customer.billingAddress,
      billingCity:         customer.billingCity,
      billingStateProvince:customer.billingStateProvince,
      billingCountry:      customer.billingCountry,
      billingPostalCode:   customer.billingPostalCode,
      loginId:             customer.loginId,
      subsPlan:            customer.subsPlan,
      subsExpiry:          customer.subsExpiry,
      discountAmount:      customer.discountAmount,
      discountPercentage:  customer.discountPercentage,
      salesRep:            customer.salesRep,
      priority:            customer.priority,
      bestWay:             customer.bestWay,
      bestTime:            customer.bestTime,
      sendSmsFlag:         customer.sendSmsFlag,
      sendEmailFlag:       customer.sendEmailFlag,
      joiningDate:         customer.joiningDate
    });
  }

  updateFlags(contactMethod: any, customer: Customer): void {
    customer.sendEmailFlag = false;
    customer.sendSmsFlag   = false;
    if (contactMethod === 'sendSmsFlag')   customer.sendSmsFlag   = true;
    else if (contactMethod === 'sendEmailFlag') customer.sendEmailFlag = true;
    else if (contactMethod === 'businessFlag') customer.businessFlag  = true;
  }

  alertWithSuccess(userId: any): void {
    Swal.fire('Submit', 'You have successfully registered as a customer', 'success');
  }

  onClear(): void { this.customerForm.reset(); }
  infoClick():         void { this.router.navigate(['info']); }
  reportClick():       void { this.router.navigate(['report']); }
  settingClick():      void { this.router.navigate(['settings']); }
  notificationClick(): void { this.router.navigate(['notification']); }
  onBsnsChk():         void { this.bsnsFlag = !this.bsnsFlag; }

  onCountryChange(): void {
    const selected = this.customerForm.get('country')?.value;
    if (selected) {
      this.customerService
        .getProvinceCityList(selected)
        .subscribe(data => this.provinceList = data);
    }
  }

  onStateChange(): void {
    const selected = this.customerForm.get('stateProvince')?.value;
    if (selected) {
      this.customerService
        .getCityList(selected)
        .subscribe(data => this.citiesList = data);
    }
  }

  toggleDiv():  void { this.showDiv  = !this.showDiv;  }
  toggleDiv1(): void { this.showDiv1 = !this.showDiv1; }

  onCountryChangeBilling(): void {
    const billing = this.customerForm.get('billingCountry')?.value;
    if (billing) {
      this.customerService
        .getProvinceCityList(billing)
        .subscribe(data => this.provinceBillingList = data);
    }
  }
>>>>>>> e99ff1c95dd1b66647fe96478b0f65a98b54e6de
}