import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { CustomerService } from '../../shared/services/customer.service';
import { Customer, Country, StateProvince, City, CodeMaster } from '../../shared/models/model-classes.model';
import { faCoffee, faSignIn, faUndo, faSave, faHome, faDashboard, faToolbox, faCog, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch, faBell, faNewspaper, faPrint, faEllipsisV, faInfo } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  // UI flags
  showAddFlag = false;
  editMode = false;
  isLoading = false;
  isSaving = false;

  // Pagination & search
  p = 1;
  searchTerm = '';
  private searchDebounce: any;

  // Data
  customerList: Customer[] = [];
  customer: Customer = new Customer();

  // Form (kept for compatibility, but we use direct ngModel)
  customerForm!: FormGroup;

  // Other lists (from original)
  countryList: Country[] = [];
  provinceList: StateProvince[] = [];
  citiesList: City[] = [];
  provinceBillingList: StateProvince[] = [];
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

  // FontAwesome icons
  faCoffee = faCoffee; faTwitter = faTwitter; faFacebook = faFacebook; faGoogle = faGoogle;
  faSignIn = faSignIn; faUndo = faUndo; faSave = faSave; faHome = faHome;
  faDashboard = faDashboard; faToolbox = faToolbox; faCog = faCog; faEdit = faEdit;
  faPlusCircle = faPlusCircle; faHistory = faHistory; faFileInvoiceDollar = faFileInvoiceDollar;
  faShoppingCart = faShoppingCart; faSort = faSort; faSearch = faSearch; faBell = faBell;
  faNewspaper = faNewspaper; faPrint = faPrint; faEllipsisV = faEllipsisV; faInfo = faInfo;

  // Other variables from original
  sendSmsFlag = false; sendEmailFlag = false; contactMethod: any; conactedselect: any;
  add = false; navigateFlag = true; submitted = false; registerFlag = false;
  errorMsg = ''; bsnsFlag = false; error = ''; showDiv = false; showDiv1 = false;
  dynamicData = 'Dynamic Placeholder'; bestwayToContact: any; customerFlag = false;
  signInUser = ''; title = 'Registration'; editFlag = false; selectedCountry = 'USA';

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.initForm();
    this.loadCountryData();
    this.checkEditMode();
  }

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
      }
    });
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.email],
      phone1: [''],
      custType: ['REGULAR'],
      address: [''],
      city: [''],
      stateProvince: [''],
      country: ['Pakistan'],
      postalCode: [''],
      discountAmount: [0],
      discountPercentage: [0]
    });
  }

  loadCountryData(): void {
    this.customerService.getCountryList().subscribe((data: Country[]) => this.countryList = data);
    this.customerService.getProvinceList().subscribe((data: StateProvince[]) => {
      this.provinceList = data;
      this.provinceBillingList = data;
    });
  }

  checkEditMode(): void {
    const source = this.activateRoute.snapshot.paramMap.get('source');
    if (source === 'EDIT') {
      this.title = 'Edit Profile';
      this.editFlag = true;
      const user = sessionStorage.getItem('currentUser');
      if (user) {
        const customer = JSON.parse(user);
        this.convertToForm(customer);
        this.selectedCountry = customer.country;
        this.customerService.getProvinceCityList(this.selectedCountry).subscribe(data => this.provinceList = data);
      }
    } else {
      this.title = 'Registration';
      this.editFlag = false;
      this.customerForm.reset();
    }
  }

  // ---------- Search with debounce ----------
  onSearchInput(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.p = 1;
    }, 300);
  }

  get filteredCustomers(): Customer[] {
    if (!this.searchTerm.trim()) return this.customerList;
    const term = this.searchTerm.toLowerCase();
    return this.customerList.filter(c =>
      c.firstName?.toLowerCase().includes(term) ||
      c.lastName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone1?.includes(term)
    );
  }

  // ---------- Add / Edit ----------
  addCustomer(): void {
    this.showAddFlag = true;
    this.editMode = false;
    this.customer = new Customer();
    this.customer.country = 'Pakistan';
    this.customer.custType = 'REGULAR';
  }

  editCustomer(cust: Customer): void {
    this.showAddFlag = true;
    this.editMode = true;
    this.customer = JSON.parse(JSON.stringify(cust));
    if (!this.customer.country) this.customer.country = 'Pakistan';
  }

  goToList(): void {
    this.showAddFlag = false;
    this.editMode = false;
    this.customer = new Customer();
  }

  // ---------- Save (with loading spinner) ----------
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
      Swal.fire('Validation', 'Phone is required', 'warning');
      return;
    }

    this.isSaving = true;

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
        }
      });
    } else {
      this.customer.custType = this.customer.custType || 'REGULAR';
      this.customer.priority = this.customer.priority || 0;
      this.customerService.saveCustomer(this.customer).subscribe({
        next: (res) => {
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
        }
      });
    }
  }

  private onSaveComplete(): void {
    this.isSaving = false;
    this.showAddFlag = false;
    this.editMode = false;
    this.loadCustomers();  // refresh list
    this.customer = new Customer();
  }

  // ---------- Delete with loading ----------
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
      }
    });
  }

  // ---------- Legacy methods (kept for compatibility) ----------
  get f(): { [key: string]: AbstractControl } { return this.customerForm.controls; }

  convertToForm(customer: Customer): void {
    this.customerForm.patchValue({
      firstName: customer.firstName, lastName: customer.lastName, email: customer.email,
      phone1: customer.phone1, address: customer.address, city: customer.city,
      stateProvince: customer.stateProvince, country: customer.country,
      postalCode: customer.postalCode, profession: customer.profession,
      businessFlag: customer.businessFlag
    });
  }

  updateFlags(contactMethod: any, customer: Customer): void {
    customer.sendEmailFlag = false;
    customer.sendSmsFlag = false;
    if (contactMethod === 'sendSmsFlag') customer.sendSmsFlag = true;
    else if (contactMethod === 'sendEmailFlag') customer.sendEmailFlag = true;
    else if (contactMethod === 'businessFlag') customer.businessFlag = true;
  }

  alertWithSuccess(userId: any): void {
    Swal.fire('Submit', 'You have successfully registered as a customer', 'success');
  }

  onClear(): void { this.customerForm.reset(); }
  infoClick(): void { this.router.navigate(['info']); }
  reportClick(): void { this.router.navigate(['report']); }
  settingClick(): void { this.router.navigate(['settings']); }
  notificationClick(): void { this.router.navigate(['notification']); }
  onBsnsChk(): void { this.bsnsFlag = !this.bsnsFlag; }
  onCountryChange(): void {
    const selectedCountry = this.customerForm.get('country')?.value;
    if (selectedCountry) this.customerService.getProvinceCityList(selectedCountry).subscribe(data => this.provinceList = data);
  }
  onStateChange(): void {
    const selectedState = this.customerForm.get('stateProvince')?.value;
    if (selectedState) this.customerService.getCityList(selectedState).subscribe(data => this.citiesList = data);
  }
  toggleDiv(): void { this.showDiv = !this.showDiv; }
  toggleDiv1(): void { this.showDiv1 = !this.showDiv1; }
  onCountryChangeBilling(): void {
    const billingCountry = this.customerForm.get('billingCountry')?.value;
    if (billingCountry) this.customerService.getProvinceCityList(billingCountry).subscribe(data => this.provinceBillingList = data);
  }
}