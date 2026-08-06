import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';

// Import NgxPaginationModule to fix 'paginate' pipe and 'pagination-controls' errors
import { NgxPaginationModule } from 'ngx-pagination';

import { LoginService } from '../../account/services/login.service';
import { CacheService } from '../../shared/services/cache.service';
import { CustomerService } from '../../shared/services/customer.service';
import { NotificationService } from '../../shared/services/notification.service';

import {
  Customer,
  CustomerCountryWrapper,
  Category,
  CodeMaster,
  Country,
  StateProvince,
  City,
  CountryStateProvince,
  CustomerRequest
} from '../../shared/models/model-classes.model';

import {
  faHome,
  faUndo,
  faSave,
  faCoffee,
  faSignIn,
  faCog,
  faDashboard,
  faToolbox,
  faInfo,
  faEllipsisV,
  faPrint,
  faNewspaper,
  faBell,
  faEdit,
  faPlusCircle,
  faHistory,
  faFileInvoiceDollar,
  faShoppingCart,
  faSort,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

import {
  faTwitter,
  faFacebook,
  faGoogle
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule // Added here for pagination support
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  showAddFlag = false;
  editMode = false;
  isSaving = false; // Fixes missing 'isSaving' property
  isLoading = false; // Fixes missing 'isLoading' property

  searchTerm: string = '';

  faCoffee = faCoffee;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  faSignIn = faSignIn;
  faUndo = faUndo;
  faSave = faSave;
  faHome = faHome;
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

  sendSmsFlag = false;
  sendEmailFlag = false;

  contactMethod: any;
  conactedselect: any;

  add = false;
  navigateFlag = true;
  submitted = false;
  registerFlag = false;

  errorMsg = '';
  error = '';

  bsnsFlag = false;

  showDiv = false;
  showDiv1 = false;

  // Variables for Customer Detail Modal
  showDetailModal = false;
  viewCustomer: Customer | any = null;

  dynamicData = 'Dynamic Placeholder';

  bestwayToContact: any;
  customerFlag = false;

  /* ===== Pagination Variables ===== */
  p: number = 1; // Fixes missing 'p' variable used in ngx-pagination
  pageSize = 10;

  get totalPages(): number {
    const len = this.filteredCustomers.length;
    return Math.max(1, Math.ceil(len / this.pageSize));
  }

  get pagedCustomerList(): Customer[] {
    const start = (this.p - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.p = page;
  }

  onSearchChange(): void {
    this.p = 1;
  }

  onSearchInput(): void {
    this.p = 1;
  }

  // NOTE: this is populated properly in initForm() during ngOnInit().
  // Kept as an empty FormGroup here to avoid maintaining two divergent
  // definitions of the same form.
  customerForm: FormGroup = new FormGroup({});

  customer: Customer = new Customer();
  customershow: any;

  customerList: Customer[] = [];
  customerCountryList: CustomerCountryWrapper[] = [];
  categoryList: Category[] = [];

  bestWayToContactList: CodeMaster[] = [
    { code: 'TEXT', description: 'TEXT' },
    { code: 'EMAIL', description: 'EMAIL' },
    { code: 'PHONE', description: 'PHONE' }
  ];

  bestTimeToContactList: CodeMaster[] = [
    { code: 'MORNING', description: 'MORNING' },
    { code: 'AFTERNOON', description: 'AFTERNOON' },
    { code: 'EVENING', description: 'EVENING' },
    { code: 'NIGHT', description: 'NIGHT' }
  ];

  countryList: Country[] = [];
  provinceList: StateProvince[] = [];
  provinceBillingList: StateProvince[] = [];
  citiesList: City[] = [];
  provinceMasterList: CountryStateProvince[] = [];

  signInUser: any = '';

  title = 'Registration';
  editFlag = false;

  selectedCountry: any = 'USA';

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cache: CacheService,
    private loginService: LoginService,
    private notify: NotificationService
  ) { }

  initForm(): void {
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
  }

  ngOnInit(): void {

    this.initForm();

    this.isLoading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customerList = data.reverse();
        this.p = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

    const user = sessionStorage.getItem('currentUser');

    if (user) {

      this.customerService.getCountryList().subscribe((data: Country[]) => {
        this.countryList = data;
      });

      this.customerService.getProvinceList().subscribe((data: StateProvince[]) => {
        this.provinceList = data;
        this.provinceBillingList = data;
      });

    } else {

      // Only fetch country list here if we didn't already fetch it above.
      this.customerService.getCountryList().subscribe((data: Country[]) => {
        this.countryList = data;
      });

    }

    window.scrollTo(0, 0);

    this.customerForm.reset();

    this.customerForm.get('salesRep')?.setValue(true);
    this.customerForm.get('sendEmailFlag')?.setValue(true);

    const source = this.activateRoute.snapshot.paramMap.get('source');

    if (source === 'EDIT') {

      this.title = 'Edit Profile';
      this.editFlag = true;

      if (user) {

        const customer = JSON.parse(user);

        this.convertToForm(customer);

        this.selectedCountry = customer.country;

        this.customerService
          .getProvinceCityList(this.selectedCountry)
          .subscribe(data => {
            this.provinceList = data;
          });

      }

    } else {

      this.title = 'Registration';
      this.editFlag = false;

    }

  }

  get f(): { [key: string]: AbstractControl } {
    return this.customerForm.controls;
  }

  onCustomerSave(source: any, customer: Customer) {

    this.submitted = true;
    this.isSaving = true;

    if (source === 'EDIT') {

      this.customerService.updateCustomer(customer).subscribe({
        next: (data) => {
          this.isSaving = false;
          if (data !== undefined && data >= 0) {

            this.signInUser = customer.firstName;

            this.notify.success('You have successfully saved the profile!');

            this.showAddFlag = false;
            this.editFlag = false;
            this.editMode = false;

            this.customerService.getAllCustomers().subscribe((res: Customer[]) => {
              this.customerList = res.reverse();
              this.p = 1;
            });
          }
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
        }
      });

    } else {

      this.customerService.saveCustomer(customer).subscribe({
        next: (data) => {
          this.isSaving = false;
          if (data && data.customer && data.customer.custId) {

            const customerRes = data.customer;

            this.signInUser = customerRes.firstName;

            this.alertWithSuccess(customerRes.custId);

            this.showAddFlag = false;
            this.editFlag = false;
            this.editMode = false;

            this.cache.set('reload', 'F');

            this.customerService.getAllCustomers().subscribe((res: Customer[]) => {
              this.customerList = res.reverse();
              this.p = 1;
            });
          }
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
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
    this.customerForm.get('address')?.setValue(customer.address);
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

  /* ****************************************** */

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

  /* ******************************************* */

  convertCustFormToVar(customer: Customer): Customer {

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

    // Important
    customer.loginId = customer.email;
    customer.custName = customer.email;

    customer.businessFlag = this.customerForm.get('businessFlag')?.value;

    customer.phone1 = this.customerForm.get('phone1')?.value;
    customer.phone2 = this.customerForm.get('phone2')?.value;

    customer.profession = this.customerForm.get('profession')?.value;
    customer.bestTime = this.customerForm.get('bestTime')?.value;

    customer.address = this.customerForm.get('address')?.value;
    customer.city = this.customerForm.get('city')?.value;
    customer.stateProvince = this.customerForm.get('stateProvince')?.value;
    customer.country = this.customerForm.get('country')?.value;
    customer.postalCode = this.customerForm.get('postalCode')?.value;

    customer.salesRep = this.customerForm.get('salesRep')?.value;

    customer.sendSmsFlag = this.customerForm.get('sendSmsFlag')?.value;
    customer.sendEmailFlag = this.customerForm.get('sendEmailFlag')?.value;

    customer.bestWay = this.bestwayToContact;

    if (customer.sendSmsFlag == null) {
      customer.sendSmsFlag = false;
    }

    if (customer.sendEmailFlag == null) {
      customer.sendEmailFlag = false;
    }

    if (customer.salesRep == null) {
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
    } else {
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

  async onDelete(custId: number | undefined) {

    if (custId == null) return;

    const confirmed = await this.notify.confirmDelete('this customer');

    if (!confirmed) {
      this.notify.info('Your customer file is safe');
      return;
    }

    this.customerService.deleteCustomer(custId).subscribe({

      next: () => {

        const index = this.customerList.findIndex(
          c => c.custId === custId
        );

        if (index > -1) {
          this.customerList.splice(index, 1);
          this.customerList = [...this.customerList];
        }

        // If the last record on the last page was deleted,
        // move back one page.
        if (this.p > this.totalPages) {
          this.p = this.totalPages;
        }

        this.notify.success('Customer has been deleted.');

      },

      error: (err) => {

        console.error('Error deleting customer:', err);
        this.notify.error('Failed to delete customer');

      }

    });

  }

  // Renamed from filteredItems to filteredCustomers to match HTML
  get filteredCustomers() {
    return this.customerList.filter(customer =>
      customer.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  save() {

    if (this.editMode) {

      this.onCustomerSave('EDIT', this.customer);

    } else {

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

    if (!this.customer.country) {
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

  // Missing methods for view details modal logic
  viewDetail(cust: Customer): void {
    this.viewCustomer = cust;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.viewCustomer = null;
  }

}