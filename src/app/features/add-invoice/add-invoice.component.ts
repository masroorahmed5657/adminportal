import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProductView, Category, Customer, Departments, Product, CartHold, PriceSummary, CustomerRequest, InvoiceOnlySaveResponse } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CustomerService } from '../../shared/services/customer.service';
import { DepartmentsService } from '../../shared/services/departments.service';
import { InvoiceService } from '../../shared/services/invoice.service';
import { ProductService } from '../../shared/services/product.service';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';


import Swal  from "sweetalert2";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { HeaderComponent } from "../../layouts/header/header.component";
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-add-invoice',
  imports: [FooterComponent, HeaderComponent,CommonModule,FormsModule,DecimalPipe],
  templateUrl: './add-invoice.component.html',
  styleUrl: './add-invoice.component.scss'
})

export class AddInvoiceComponent implements OnInit {
  mobileshow: any = false;
  nameSearchModal: any = false;
  logoName = environment.logoName;
  categoryId: number = 0;
  public isLoggedIn = false;
  faSignOut = faSignOut;
  result: any = '';
  totalDiscount: any = '';
  FbrCharges = 1;
  search: any;
  myScan = '';
  myCode = '';
  searchbyname: any;
  productcheckList: ProductView[] = [];
  searchProducts: ProductView[] = [];
  errormessage = '';
  productQuantity: number = 1;
  productWeight: number = 1;
  categoryMasterList: Category[] = [];
  categoryList: Category[] = [];
  todaydatashow = new Date();
  signInUser: any = '';
  guestFlag = false;
  customer: Customer = new Customer();
  departmentList: Departments[] = [];
  departmentMasterList: Departments[] = [];
  rangeValue = 100;
  productViewList: ProductView[] = [];
  productList: Product[] = [];
  productMasterViewList: ProductView[] = [];
  // productViewList:ProductView=new  ProductView();
  errorMsg = '';
  spinnerDataLoad = false;
  selectedCategory: any;
  shopCategory: Category = new Category();
  searchFlag = false;
  searchParam = '';
  modalOpen: boolean = false;
  modalOpen1: boolean = false;
  modalOpen2: boolean = false;
  customerBalance: number = 0;
  items: any[] = []; // Assuming this array contains your items
  cartDataList: CartHold = new CartHold();
  holdSales: CartHold[] = [];

  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal: 0,
  };


  cartForm: FormGroup = new FormGroup({
    qty: new FormControl(),
    notes: new FormControl(''),
    pickupType: new FormControl('IN STORE'),
    pickupTime: new FormControl('MORNING'),
  });

  customerForm: FormGroup = new FormGroup({
    loginId: new FormControl(''),
    loginPassword: new FormControl(''),
    custId: new FormControl(''),
    custName: new FormControl(''),
    firstName: new FormControl('noman', [Validators.required]),
    lastName: new FormControl('khalid', [Validators.required]),
    businessFlag: new FormControl(false),
    addressId: new FormControl(''),
    email: new FormControl('noman@gmail.com', [Validators.required]),
    custType: new FormControl(''),
    phone1: new FormControl('3234234234234', [Validators.required]),
    phone2: new FormControl(''),
    custPic: new FormControl(''),
    profession: new FormControl(''),
    priority: new FormControl(''),
    bestWay: new FormControl(''),
    bestTime: new FormControl(''),
    sendSmsFlag: new FormControl(''),
    sendEmailFlag: new FormControl(''),
    address1: new FormControl(''),
    address2: new FormControl(''),
    city: new FormControl(''),
    stateProvince: new FormControl(''),
    country: new FormControl(''),
    postalCode: new FormControl(''),
  });


  constructor(private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductService,
    private departmentsService: DepartmentsService,
    private customerService: CustomerService,
    private invoice: InvoiceService
  ) { }

  ngOnInit(): void {
    let holdData = localStorage.getItem('localCart');
    this.signInUser = sessionStorage.getItem("username");

    if (holdData) {
      this.cartDataList = JSON.parse(holdData);

    }
    this.calculateTotalPrice();
    window.scrollTo(0, 0);
    this.errorMsg = '';
    this.searchFlag = false;
    let search = '';
    /*
    
      let catId: number = Number(this.route.snapshot.paramMap.get('catId'));
      this.spinnerDataLoad = true;
      //* ********* Department and Category List ****************** 
      this.productService.getCategoryList().subscribe((data: Category[]) => {
        this.categoryList = data;
        this.calculateTotalPrice();
        this.shopCategory = this.getCategoryName(catId);
      });
      this.departmentsService
        .getDepartmentList()
        .subscribe((data: Departments[]) => {
          this.departmentMasterList = data;
          if (data != null || data != undefined) {
            for (let i = 0; i < this.departmentMasterList.length; i++) {
              if (this.departmentMasterList[i].activeFlag) {
                this.departmentList.push(this.departmentMasterList[i]);
              }
            }
          }
        });
    
     */
    /*
        if (catId !== null || catId !== undefined) {
        this.selectedCategory = catId;
        if (catId < 0) {
          //It is from global search in header
          this.productViewList = JSON.parse(this.cache.getList('searchProducts'));
          this.spinnerDataLoad = false;
          this.searchFlag = true;
          this.searchParam = this.cache.get('searchParam');
        } else {
          //Get all Products
          this.productService
            .getProducts(catId)
            .subscribe((data: ProductWrapper) => {
              let myData = data;
              if (myData != undefined) {
                if (myData.productList.length > 0) {
                  this.productViewList = this.productDecorator(
                    myData.productList
                  );
                  this.cache.setList(
                    'productMasterViewList',
                    JSON.stringify(this.productViewList)
                  );
                } else {
                  this.errorMsg = 'Items are out of Stock';
                }
                this.spinnerDataLoad = false;
              }
            });
        }
      }
    */



  }//ngOnInit()

  /* *********************************************************************** */
  productDecorator(productList: ProductView[]): any {
    //find out make and model
    //this.productViewList = productList;
    let myCategory: Category;
    let j = 0;
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].productStatus === 'A') {
        this.productViewList[j] = new ProductView();

        myCategory = this.getCategoryName(productList[i].categoryId);

        this.productViewList[j].category = myCategory.category; // productList[i].category;
        this.productViewList[j].categoryId = productList[i].categoryId;
        this.productViewList[j].subCategory = myCategory.subCategory;
        this.productViewList[j].productId = productList[i].productId;
        this.productViewList[j].productName = productList[i].productName;
        this.productViewList[j].productDetails = productList[i].productDetails;
        this.productViewList[j].sku = productList[i].sku;
        this.productViewList[j].custId = productList[i].custId;
        this.productViewList[j].unitPrice = productList[i].unitPrice;
        this.productViewList[j].salePrice = productList[i].salePrice;
        this.productViewList[j].quantity = productList[i].quantity;
        this.productViewList[j].discount = productList[i].discount;
        this.productViewList[j].popularFlag = productList[i].popularFlag;
        this.productViewList[j].productStatus = productList[i].productStatus;
        this.productViewList[j].packagingAttributes =
          productList[i].packagingAttributes;
        this.productViewList[j].cuttingAttributes =
          productList[i].cuttingAttributes;
        this.productViewList[j].extraAttributes =
          productList[i].extraAttributes;
        this.productViewList[j].optionsAttributes =
          productList[i].optionsAttributes;

        this.productViewList[j].showFlag =
          productList[i].productStatus === 'A' ? true : false;

        //Just for safe side
        this.productViewList[j].productImage = productList[i].productImage;
        this.productViewList[j].imageMimeType = productList[i].imageMimeType;
        j++;
      }
    }
    return this.productViewList;
  }
  /* *********************************************************************** */
  getCategoryName(categoryId: any): Category {
    let category: Category = new Category();
    for (let i = 0; i < this.categoryMasterList.length; i++) {
      if (categoryId === this.categoryMasterList[i].categoryId) {
        category.categoryId = this.categoryMasterList[i].categoryId;
        category.category = this.categoryMasterList[i].category;
        category.subCategory = this.categoryMasterList[i].subCategory;

        break;
      }
    }

    return category;
  }
  /* ************************************************************** */

  addToCart(productView: ProductView, quantity: number = 1) {
    if (productView) {
      // Increment product quantity

      let rcvdProduct = new CartHold();

      let localCartData = localStorage.getItem('localCart');
      if (localCartData) {
        //Now get the existing cart with products/customer and other data
        rcvdProduct = JSON.parse(localCartData);
      }
      else {
        //create brand new cart 
        rcvdProduct.customer = new Customer();
        rcvdProduct.shipping = this.cartDataList.shipping;
        rcvdProduct.subTotal = this.cartDataList.subTotal;
        rcvdProduct.taxes = this.cartDataList.taxes;
        rcvdProduct.transactionId = 0;
        rcvdProduct.total = this.cartDataList.total;

      }
      productView.quantity = this.productQuantity;

      rcvdProduct.product.push(productView);

      this.productService.addToHoldCart(rcvdProduct);
      this.calculateTotalPrice();
      //this.cartDataList1.push(rcvdProduct);


      // Add the product directly to the cart
      // this.productService.localAddToCart(cartHold);

      // Show confirmation message
      // Swal.fire('Shopping Cart', 'Item has been added to Cart', 'success');



      // Log productId and quantity to console
    } else {
      console.warn('Product is empty');
    }
  }

  /* ************************************************************** */
  onSearch() {
    let t1 = this.search;
    let t2 = <HTMLInputElement>document.getElementById('name-search');
    this.search = t2.value;

    if (
      this.search === null ||
      this.search === undefined ||
      this.search === ''
    ) {
    }

    this.productService.getCategoryList().subscribe((data: Category[]) => {
      this.categoryList = data;
    });

    this.productService
      .getSearchProducts(this.search)
      .subscribe((data: any) => {
        this.searchProducts = this.productDecorator(data.productList);
        if (this.searchProducts.length > 0) {
          this.cache.setList(
            'searchProducts',
            JSON.stringify(this.searchProducts)
          );
          this.cache.set('searchParam', this.search);
          this.nameSearchModal = true;
        } else {
          this.errormessage = 'No Record, No Record Found';

          setTimeout(() => {
            Swal.fire('No Record, No Record Found');
            this.showAlert();
          }, 6000);
        }
      });
  }
  /* ************************************************************** */
  showAlert() {
    this.search = '';
    this.errormessage = '';
  }
  /* ************************************************************** */
  nameSearch(event: KeyboardEvent) {
    let s1 = event;
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
  /* ************************************************************** */
  upcSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('upc-search');
      if (qtyInput === undefined) {
        return;
      }
      let upc = qtyInput.value;
      if (upc !== undefined || upc !== '') {
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          let productId = data.productId;
          // this.searchbyname=data.productList;
          if (productId === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
          } else if (productId !== null || productId !== undefined) {
            let rcvdProduct = new CartHold();

            let localCartData = localStorage.getItem('localCart');
            if (localCartData) {
              //Now get the existing cart with products/customer and other data
              rcvdProduct = JSON.parse(localCartData);
            } else {
              //create brand new cart of type cartHold
              rcvdProduct.customer = new Customer();

              rcvdProduct.shipping = this.priceSummary.delivery;
              rcvdProduct.subTotal = this.priceSummary.total;
              rcvdProduct.dicsount = this.priceSummary.discount;
              rcvdProduct.taxes = this.priceSummary.tax;
              rcvdProduct.transactionId = 0;
              rcvdProduct.total = this.priceSummary.grandTotal;
            }
            data.quantity = this.productQuantity;

            rcvdProduct.product.push(data);

            this.productService.addToHoldCart(rcvdProduct);
            //this.cartDataList1.push(rcvdProduct);
            window.location.reload();
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }
  /* ************************************************************** */
  skuSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('sku-search');
      if (qtyInput === undefined) {
        return;
      }

      let sku = qtyInput.value;
      if (sku !== undefined || sku !== '') {
        //serach product by UPC
        this.productService.getProductsBySKU(sku).subscribe((data) => {
          let productId = data.productId;
          //// this.searchbyname=data.productList;
          if (productId === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          } else if (productId !== null || productId !== undefined) {
            let rcvdProduct = new CartHold();

            let localCartData = localStorage.getItem('localCart');
            if (localCartData) {
              //Now get the existing cart with products/customer and other data
              rcvdProduct = JSON.parse(localCartData);
            } else {
              //create brand new cart of type cartHold
              rcvdProduct.customer = new Customer();
              rcvdProduct.shipping = 0;
              rcvdProduct.subTotal = 0;
              rcvdProduct.taxes = 0;
              rcvdProduct.transactionId = 0;
              rcvdProduct.total = 0;
            }
            data.quantity = this.productQuantity;

            rcvdProduct.product.push(data);

            this.productService.addToHoldCart(rcvdProduct);
            //this.cartDataList1.push(rcvdProduct);

            this.productService.addToHoldCart(rcvdProduct);
            window.location.reload();
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }





  /****************************** */

  priceCheckByUpc(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('priceCheck');
      if (qtyInput === undefined) {
        return;
      }
      let upc = qtyInput.value;
      if (upc !== undefined || upc !== '') {
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          let productId = data.productId;
          // this.searchbyname=data.productList;
          if (productId === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
          } else if (productId !== null || productId !== undefined) {
            let rcvdProduct = new ProductView();
            //let localCartData = localStorage.getItem('localCart');
            // if (localCartData) {
            //Now get the existing cart with products/customer and other data
            // rcvdProduct = JSON.parse(localCartData);
            //  } else {
            //create brand new cart of type cartHold
            //  rcvdProduct.customer = new Customer();
            //  rcvdProduct.shipping = 0;
            //   rcvdProduct.subTotal = 0;
            //  rcvdProduct.taxes = 0;
            //  rcvdProduct.transactionId = 0;
            //  rcvdProduct.total = 0;
            // }
            rcvdProduct.productName = data.productName;
            rcvdProduct.discount = data.discount;
            rcvdProduct.unitPrice = data.unitPrice;
            rcvdProduct.salePrice = data.salePrice;

            this.productcheckList.push(rcvdProduct);
            //this.cartDataList.push(rcvdProduct);



            //data.quantity = this.productQuantity;
            // rcvdProduct.product.push(data);
            // this.productService.localAddToCart(rcvdProduct);
            // this.cartDataList.push(rcvdProduct);
            // window.location.reload();
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }
  /* ************************************************************** */



  /* ************************************************************** */
  removeCart() {
    this.productService.clearCart();
    window.location.reload();
  }
  /* ************************************************************** */
  openModal() {
    this.modalOpen = true;
  }
  /* ************************************************************** */
  openModal1() {
    let localCart = localStorage.getItem('localCart');
    //localcart data check
    if (localCart) {

      let cartDataArray = JSON.parse(localCart);
      if (Object.keys(cartDataArray.product).length > 0) {
        // Swal.fire("Please complete the transections");
        Swal.fire('WARNING', 'Please complete Your transaction', 'warning')
        return;
      } else {

        let cartData = cartDataArray[0];
      }
    } else {

    }

    //retrive list show
    let holdSalesObj = this.cache.getList('holdCartList');
    this.holdSales = holdSalesObj;


    let holdSaleArray: CartHold[] = [];
    //Not an array, just carthold object
    if (this.holdSales.length === undefined) {
      holdSaleArray.push(holdSalesObj);
      this.holdSales = holdSaleArray;

    }



    this.modalOpen1 = true;

  }
  /* ************************************************************** */
  closeModal1() {
    this.modalOpen1 = false;
  }
  /* *************************************************************** */
  closeNameSearchModal() {
    this.nameSearchModal = false;
  }
  /* ************************************************************** */
  closeModal() {
    this.modalOpen = false;
    this.clearFields();
  }
  /* ************************************************************** */
  /* ************************************************************** */
  openModal2() {
    if (!this.customer.firstName) {
      // Show alert for required fields
      Swal.fire('WARNING', 'Please fill The Customer Name', 'warning');
      return; // Don't proceed with saving
    }

    let localCart = localStorage.getItem('localCart')
    if (localCart === undefined || localCart === '' || localCart === null || localCart.length === 105 || localCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }


    this.modalOpen2 = true;

  }
  /* ************************************************************** */
  closeModal2() {
    this.modalOpen2 = false;
  }
  /* ************************************************************** */
  /* ************************************************************** */
  clearFields() {
    // Clear the priceCheck property in the component
    let priceCheckInput = document.getElementById(
      'priceCheck'
    ) as HTMLInputElement; // Get the input element
    if (priceCheckInput) {
      priceCheckInput.value = ''; // Reset the input field value
    }

    this.productcheckList = [];
  }
  /* ************************************************************** */
  // Method to hold the current sale
  holdSale() {
    // Check if any of the input fields are empty
    this.cartDataList.customer.firstName = this.customer.firstName;
    this.cartDataList.customer.email = this.customer.email;
    this.cartDataList.customer.phone1 = this.customer.phone1;


    if (!this.customer.firstName) {
      // Show alert for required fields
      Swal.fire('WARNING', 'Please fill The Customer Name', 'warning');
      return; // Don't proceed with saving
    }
    let holdCartList: CartHold[] = [];
    let localCart = localStorage.getItem('localCart');
    //localCart = always one object of cartHold type
    //holdCarts =  could be array list of localCarts of type cartHold[]
    if (localCart) {
      let holdCartListObj: any;
      //this cart list in hold already
      holdCartListObj = localStorage.getItem('holdCartList');

      if (holdCartListObj === null) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;

        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }
      else if (holdCartListObj === undefined) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;

        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);

      }
      else if (holdCartListObj === '') {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }
      else if (holdCartListObj.length === 0) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }

      else if (holdCartListObj === '[]') {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }




      else {
        //holdCartList is an array of cartHolds or it is an ONE object of CartHold
        // holdCartList= JSON.parse(holdCartListObj);
        //Only one object in Hold already
        let holdCartList = JSON.parse(holdCartListObj);
        let newHoldCartList: CartHold[] = [];

        let localCartObj: CartHold = JSON.parse(localCart);
        if (holdCartList.length === undefined) {

          localCartObj.transactionId = holdCartList.transactionId + 1;

          localCartObj.customer = this.customer;
          newHoldCartList.push(holdCartList);
          newHoldCartList.push(localCartObj);
          //Overwrite current one CartHold Object in cache with 2 carthold for 2 customers
          this.cache.setList('holdCartList', newHoldCartList);

        }
        else if (holdCartList.length > 0) {
          //This is the case when CartHold is having multiple customers cart
          let newHoldCartList: CartHold[] = [];
          let localCartObj: CartHold = JSON.parse(localCart);
          localCartObj.transactionId = holdCartList[holdCartList.length - 1].transactionId + 1;
          localCartObj.customer = this.customer;




          newHoldCartList.push(...holdCartList);
          newHoldCartList.push(localCartObj);
          //Overwrite current one CartHold Object in cache with 2 carthold for 2 customers
          this.cache.setList('holdCartList', newHoldCartList);

        }

      }//else
      localStorage.removeItem('localCart');
      window.location.reload();

    }
  }// Reload the window
  /* ************************************************************** */
  appendToResult(value: string) {
    this.result += value;
    this.calculateBalance();
  }
  /* ************************************************************** */
  clear() {
    this.result = '';
  }
  /* ************************************************************** */
  backSpace() {
    // Remove the last character from cashPaid
    this.result = this.result.slice(0, -1);
  }

  calculate() {
    try {
      // this.result = eval(this.result);
    } catch (error) {
      this.result = 'Error';
    }
  }
  /* ************************************************************** */
  signOut() {
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    this.cache.resetAllData();

    this.isLoggedIn = false;
    if (this.isLoggedIn) {
      //this.loginService.logOutUser();
      //this.serverLogout();
    }
    this.router.navigate(['login']);
  }
  /* ************************************************************** */
  chkNumber1(row: number) {
    let qtyInput = <HTMLInputElement>document.getElementById('Qty_' + row);
    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      if (qty < 1) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative Qty is not allowed', 'warning');
        return;

      }
      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);
      }
    }
  } //chkNumber
  /* ************************************************************* */
  qtyChange(row: number) {

    let qtyInput = <HTMLInputElement>document.getElementById('Qty_' + row);

    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      if (qty < 1) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative Qty is not allowed', 'warning');
        return;

      }
      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);
      }
    }

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let qtydata = JSON.parse(localCartData);
      qtydata.product[row].quantity = qtyInput.value;
      localStorage.setItem('localCart', JSON.stringify(qtydata))


    }
    //alert('qtyChange'+ qty.value);


    this.cartDataList.product[row].quantity = qtyInput.value;




    this.calculateTotalPrice();
  }
  /* ******************************************************* */

  calculateTotalPrice() {
    let priceTotal: any = 0;
    if (this.cartDataList.product.length > 0) {
      for (let i = 0; i < this.cartDataList.product.length; i++) {
        let salePrice = this.cartDataList.product[i].salePrice;
        let unitPrice = this.cartDataList.product[i].unitPrice;

        if (salePrice != undefined) {
          //Added logic for MEAT Only products. Don't show price and don't add to Total
          let myCategory = this.getCategoryName(
            this.cartDataList.product[i].categoryId
          );
          if (myCategory.category !== 'MEAT') {
            let price = salePrice * this.cartDataList.product[i].quantity;
            priceTotal = priceTotal + price;
          }
        }
        else if (unitPrice != undefined) {
          //Added logic for MEAT Only products. Don't show price and don't add to Total
          let myCategory = this.getCategoryName(
            this.cartDataList.product[i].categoryId
          );
          if (myCategory.category !== 'MEAT') {
            let price = unitPrice * this.cartDataList.product[i].quantity;
            priceTotal = priceTotal + price;
          }
        }



      }//for loop

      let p1 = Number(priceTotal).toFixed(2);
      this.priceSummary.total = Number(p1);

    }
    else {
      //No item in cart
      this.priceSummary.total = Number(0);
    }
    this.calculateBalance();

  }


  /* ********************************************* */
  removeItem(orderItem: any, index: any) {
    let item = orderItem;
    let details = this.cartDataList.product[index]?.productDetails;
    this.cartDataList.product.splice(index, 1);

    this.calculateTotalPrice();
    localStorage.setItem('localCart', JSON.stringify(this.cartDataList));
    //window.location.reload();
  }
  /* ******************************************************* */
  getProduct(productId: any): Product {
    let productData: Product = new Product();
    this.productService.getProduct(productId).subscribe((result) => {
      productData = result; //one record
      return productData;
    });
    return productData;
  }
  /* ********************************************** */
  guestCheckout() {
    let localCart = localStorage.getItem('localCart');
    if (localCart == '' || localCart == undefined) {
      Swal.fire('Your Cart is Emty');
      return;
    }
    if (localCart != null || localCart != undefined) {
      this.cartDataList = JSON.parse(localCart);
    }
    // let currentUser: any = sessionStorage.getItem('currentUser');
    let customer: any = JSON.parse(localCart);

  } //guestCheckout()
  /* ******************************************************* */



  /* ******************************************************* */
  weightChange(index: number) {
    //let qty = this.cartForm.get('qty')?.value;
    let qty = <HTMLInputElement>document.getElementById('weight_' + index);
    //alert('qtyChange'+ qty.value);
    this.cartDataList.product[index].quantity = qty.value;
    this.calculateTotalPrice();
  }
  /* ********************************************* */

  // toFixDecimalNumber(item: Product): number {
  //   let myNumber = '';
  //   if (item.sellinPcs) {
  //     myNumber = Number(item.quantity * item.salePrice).toFixed(2);
  //   } else {
  //     myNumber = Number(item.weight * item.salePrice).toFixed(2);
  //   }
  //   return Number(myNumber);
  // }

  // toNumber(price: any): number {
  //   let myNumber = Number(price).toFixed(2);
  //   return Number(myNumber);
  // }

  // toFixDecimalNumbera(quantity: any, salePrice: any): number {
  //   let myNumber = Number(quantity * salePrice).toFixed(2);
  //   return Number(myNumber);
  // }

  toFixDecimalNumbera(product: ProductView): number {
    let totalPrice;

    if (product.salePrice !== null && product.salePrice !== undefined) {
      totalPrice = Number(product.quantity * product.salePrice).toFixed(2);
    } else {
      totalPrice = Number(product.quantity * product.unitPrice).toFixed(2);
    }
    return Number(totalPrice);
  }






  /* ********************************************* */
  chkNumber() {
    if (this.productQuantity != null || this.productQuantity != undefined) {
      let len = this.productQuantity.toString().length;

      if (len > 2) {
        this.productQuantity = Number(
          this.productQuantity.toString().slice(0, 2)
        );
      }
    }
  } //chkNumber

  /* ************************************************************ */
  // get f(): { [key: string]: AbstractControl } {
  //   return this.customerForm.controls;
  // }

  /* ************************************************************ */
  onCustomerSave(source: any) {
    // Check if any of the input fields are empty
    if (this.result < this.priceSummary.total) {

      Swal.fire('WARNING', 'Payment is Not Enough', 'warning');
      return; // Don't proceed with saving


    }

    //This methods gets called from Guest Customer Data Entry form, when user click Checkout after entering his/her data.
    let customer = new Customer();
    customer = this.convertCustFormToVar(customer);

    customer.firstName = this.customer.firstName;
    customer.email = this.customer.email;
    customer.phone1 = this.customer.phone1;
    customer.custType = 'C';
    customer.priority = 1;
    customer.loginPassword = '123';

    let customerRequest: CustomerRequest = new CustomerRequest();
    customerRequest = customer;

    this.customerService.saveCustomer(customerRequest).subscribe((data) => {
      let userData = data;
      if (data !== undefined) {
        let customer = data.customer;
        if (customer.custId !== null) {
          this.signInUser = this.signInUser;
          sessionStorage.setItem('signInUser', this.signInUser);
          sessionStorage.setItem('currentUser', JSON.stringify(customer));

          this.guestCheckout();
          // window.location.reload();
        }
      }
    });
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
  }

  /* ******************************************* */
  convertCustFormToVar(customer: Customer) {
    customer.loginId = this.customerForm.get('loginId')?.value;
    customer.loginPassword = this.customerForm.get('loginPassword')?.value;
    customer.custName = this.customerForm.get('custName')?.value;
    customer.firstName = this.customerForm.get('firstName')?.value;
    this.signInUser = this.signInUser;
    customer.lastName = this.customerForm.get('lastName')?.value;
    customer.email = this.customerForm.get('email')?.value;
    customer.loginId = customer.email; //Important
    customer.custName = customer.email; //Important
    customer.businessFlag = this.customerForm.get('businessFlag')?.value;
    customer.phone1 = this.customerForm.get('phone1')?.value;
    //customer.phone2 = this.customerForm.get('phone2')?.value;
    customer.profession = this.customerForm.get('profession')?.value;
    customer.bestWay = this.customerForm.get('bestWay')?.value;
    customer.bestTime = this.customerForm.get('bestTime')?.value;
    customer.sendSmsFlag = this.customerForm.get('sendSmsFlag')?.value;
    customer.sendEmailFlag = this.customerForm.get('sendEmailFlag')?.value;
    customer.address = this.customerForm.get('address1')?.value;
    customer.city = this.customerForm.get('city')?.value;
    customer.stateProvince = this.customerForm.get('stateProvince')?.value;
    customer.country = this.customerForm.get('country')?.value;
    customer.postalCode = this.customerForm.get('postalCode')?.value;

    return customer;
  }
  /* *********************************************************************************** */

  printThermal(): void {
    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {
      // popupWin.document.open();

      let orderAddress =
        this.customer?.address +
        ',' +
        this.customer?.city +
        ',' +
        this.customer?.stateProvince +
        ',' +
        this.customer?.postalCode;

      let myCss = this.getCss();

      let myHead = `
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Ezpz Foody Receipt</title>
      </head>    `;

      let myHtml = ` <html> ` + myHead;
      //let myBodyOrder = `<body >
      let myBodyOrder =
        `<body onload="window.print();window.close();">
      <div class="ticket">
      <p class="centered" style="margin-left:40px !important;"><b>EZPZ FOODY</b><br>
      NTN # 0234343433
      <p class="centered" style="font-size:10px;">Bahria Town Karachi,Pakistan. 1054 Robinson</p>
      <p class="centered"><span>0321-9532952</span>
      <p class="centered" style="margin-top:-20px;"><span>0321-9532952</span>
      
  
      <h1 class="centered" style="font-size:13px;" style="margin-left:30px !important;"><b>Sale Receipt &nbsp;&nbsp;` +
        this.customer.firstName +
        `</b></h1>
  
     <span class="b"><b>Date/Time</b></span>:&nbsp;&nbsp;&nbsp;&nbsp;` +
        this.todaydatashow.getDate() +
        '-' +
        this.todaydatashow.getMonth() +
        1 +
        '-' +
        this.todaydatashow.getFullYear() +
        '  ' +
        this.todaydatashow.getHours() +
        ':' +
        this.todaydatashow.getMinutes() +
        `
          <table style="list-style:none;font-size:10px;text-align:left">
              <thead>
                  <tr>
                      <td ><b>Product Description</b></td>
                  </tr>
                  <tr>
                  <td  ><b>Quantity</b></td>
                  <td ><b>Price</b></td>
                  <td ><b>Total</>
              </tr>
              </thead>
              <tbody>`;

      let myItems = ``;
      let subtotal = 0;
      let tax = 0;
      let FbrCharges = 1;
      let total = 0;
      for (let i = 0; i < this.cartDataList.product.length; i++) {
        const price = Math.round(this.cartDataList.product[i].salePrice
          ? this.cartDataList.product[i].salePrice
          : this.cartDataList.product[i].unitPrice)

        subtotal += price * this.cartDataList.product[i].quantity;
        // tax = this.cartDataList[i].tax || 0 ;
        total = subtotal - this.totalDiscount + this.FbrCharges;

        myItems +=
          `<tr>
              <td><b>` +
          this.cartDataList.product[i].productName +
          `</b></td>
          </tr>
          <tr>
              <td><b>` +
          this.cartDataList.product[i].quantity +
          `</b></td>
              <td><b>` +
          price +
          `</b></td>
              <td><b>` +
          price * this.cartDataList.product[i].quantity +
          `</b></td>
          </tr>`;
      }


      let mySubTotal = Math.round(Number(subtotal));
      let myDiscount = Math.round(Number(this.totalDiscount));
      let myTax = Math.round(Number(tax));
      let fbrPos = Math.round(Number(this.FbrCharges));
      let myTotal = Math.round(Number(total));

      let myBottonHtml =
        `
  
          </tbody>
          </table>
          <tr><br>
          <td >Sub Total:</td>
          <td style="text-align: center;">Rs ` +
        mySubTotal +
        ` </td>
          </tr><br>
          <tr>
          <td >Discount:</td>
          <td style="text-align: center;">Rs ` +
        myDiscount +
        ` </td>
          </tr><br>
          <tr>
          <td >Tax:</td>
          <td style="text-align: center;">Rs ` +
        myTax +
        ` </td>
          </tr><br>
          <tr>
          <td >POS Charges</td>
          <td style="text-align: center;">Rs ` +
        fbrPos +
        ` </td>
          </tr><br>
          <td ><b>Total: </b></td>
          <td style="text-align: center;"><b>Rs ` +
        myTotal +
        `</b> </td>
          </tr><br><br>
          <tr>
          <td >Cash Paid:</td>
          <td style="text-align: center;">Rs ` +
        this.result +
        ` </td>
          </tr><br>
          <td ><b>Customer Balance: </b></td>
          <td style="text-align: center;"><b>Rs ` +
        (this.customerBalance) +
        `</b> </td>
          </tr>
          <p class="centered" style="margin-left:10px !important;">EZPZFOODY Invoice #
          <br>
          <img src="assets/images/ezpzfoody.png" id="imagea" width="100%" height="20%" style="margin-left:-10px!important;">
          
          <p class="centered" style="margin-left:10px !important;"><b>Terms And Conditions</b><p>
  
               <p style="font-size:10px;">Exchange With in 07 Days with original packing and receipt </p>
               <p style="font-size:10px;margin-top:-5px !important;">Exchange or Return due to quality efficacy</p>
               <p style="font-size:10px;margin-top:-5px !important;">No Cash Refund within 07 days as credit voucher </p>
  
         <p class="centered" style="margin-left:10px !important;"><b>Free Gift Pomotion</b><br>
         <img src="assets/images/barcode.jpg" id="imagea" width="100%" height="10%" style="margin-left:-20px !important;>
  
         <p class="centered" style="margin-left:10px !important;"><b>Terms And Conditions</b>
         <p style="font-size:10px !important;">This voucher is valid for 3 Sparkletts Dringkin Water 1.5 L.tr</p>
  
  
  
         <p id="abc" style="font-size:10px;">Software Developed By <b id="abcc">Techmaci</b> &nbsp;&nbsp;&nbsp;&nbsp;
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Ph 021-12345678-9 |
         <p id="abc2" style="font-size:10px;">www.techmaci.com
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Cell 033312345678 |
  
       
         <h3 class="centered" style="font-size:10px !important;" style="margin-left:30px !important;">  Did You Get Your <br>
         <span class="centered" style="font-size:10px !important;" style="margin-left:30px !important;"> Free Gift ?</span>
  
         <p class="centered" style="font-size:10px !important;" style="margin-left:30px !important;">For Delivery / Whatsapp <br>
         <Span style="font-size:10px !important;" > 0310-1010-725 (PAK) </span>
         
         <p class="centered" style="font-size:10px !important;" style="margin-left:30px !important;">Thanks for your purchase!
         
     </div>
          <p style="margin-left:30px !important;">
          <b>Thanks for your purchase!</b>
          </p>
      </div>
    </body>
    </html>`;
      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;

      popupWin.document.write(myFinalHtml);

      popupWin.document.close();


    } //end if
  } //print()
  /* ******************************************************** */

  getCss(): string {
    //font-family: 'monospace sans-serif';

    let myCss = `
      * {
      font-size: 12px;
      font-family: 'Times New Roman';
  }
  
  
  #imageb {
    width:150px;
    height:65px;
  }
  
  #abc {
    font-size: 8px;
  }
  
  #abc2 {
    font-size: 8px;
  
  }
  
  #abcc{
    font-size: 10px;
  }
  
  #imagea{
     width:80px;
     height:80px;
  }
  
  
  #texta {
  text-align :right;
  
  }
  
  td,
  th,
  tr,
  table {
      border-top: 1px solid black;
      border-collapse: collapse;
      font-size:8px;
      margin-top:-20px;
  }
  
  td.description,
  th.description {
      width: 75px;
      max-width: 75px;
      font-size:8px;
  }
  
  td.quantity,
  th.quantity {
      width: 40px;
      max-width: 40px;
      word-break: break-all;
      font-size:8px;
  }
  
  td.price,
  th.price {
      width: 60px;
      max-width: 60px;
      font-size:8px;
  
  }
  
  .centered {
      text-align: center !important;
      align-content: center;
      margin-left:36px !important;
  }
  
  .ticket {
      width: 200px;
      max-width: 200px;
  }
  
  img {
      max-width: inherit;
      width: inherit;
  }
  
  .totalitems{
    font-size:8px;
    font-weight:300px;
  }
  
  @media print {
      .hidden-print,
      .hidden-print * {
          display: none !important;
      }
  }`;

    return myCss;
  }


  calculateBalance(): void {

    let cashPaid = parseFloat(this.result) || 0;
    let cashDiscount = parseFloat(this.totalDiscount) || 0;
    let invoiceTotal = Number(this.priceSummary.total) || 0;

    this.priceSummary.grandTotal = invoiceTotal - (this.priceSummary.tax + cashDiscount);
    // Calculate the balance
    this.customerBalance = Math.round(cashPaid - this.priceSummary.grandTotal - this.FbrCharges);
  }

  getTodayDate(): Date {
    return new Date();
  }

  calculateTotalQuantity(): number {
    let totalQuantity = 0;
    for (let hold of this.holdSales) {
      for (let cartItem of hold.cartData) {
        totalQuantity += cartItem.quantity;
      }
    }
    return totalQuantity;
  }

  // Function to calculate total items
  getTotalItems(cartHold: any[]): number {
    let totalItems = 0;
    for (let cartItem of cartHold) {
      totalItems += cartItem.quantity;
    }
    return totalItems;
  }

  // Function to calculate grand total
  getGrandTotal(cartHold: any[]): number {
    let grandTotal = 0;
    for (let cartItem of cartHold) {
      const price = cartItem.salePrice ? cartItem.salePrice : cartItem.unitPrice;
      grandTotal += cartItem.quantity * price;
    }
    return grandTotal;
  }



  /******************** holdsale row data show in localcart***************************** */
  showHoldSaleDetails(cartHold: CartHold): void {
    let data = localStorage.getItem('localCart');
    this.productService.addToHoldCart(cartHold);
    this.customer.firstName = cartHold.customer.firstName;
    this.customer.phone1 = cartHold.customer.phone1;
    this.customer.email = cartHold.customer.email;



    this.deleteHoldSalesFromCache(cartHold.transactionId);
    window.location.reload();
  }


  /***************************************************** */

  /********************retrive data click row delete*************************** */
  deleteHoldSalesFromCache(transactionId: any): void {

    const holdSalesFromCache = localStorage.getItem('holdCartList');
    if (holdSalesFromCache) {
      let holdSales: any[] = JSON.parse(holdSalesFromCache);
      //When only one object
      if (holdSales.length === undefined) {
        localStorage.setItem('holdCartList', '');
      }
      else {//when there is an array of objects
        for (let i = 0; i < holdSales.length; i++) {
          if (holdSales[i].transactionId === transactionId) {
            holdSales.splice(i, 1);
          }
        }
        localStorage.setItem('holdCartList', JSON.stringify(holdSales));
      }







    } else {

    }
    window.location.reload();
  }


  calculateCartTotal(): number {
    this.priceSummary.total = 0;
    for (let item of this.cartDataList.product) {
      const price = item.salePrice ? item.salePrice : item.unitPrice;
      this.priceSummary.total += item.quantity * price;
    }
    return Math.round(this.priceSummary.total - this.totalDiscount);
  }

  show() {
    this.mobileshow = false;
  }

  hide() {
    this.mobileshow = true;

  }

  onSave() {
    //      alert('Save');
    let invoiceRequest: InvoiceOnlySaveResponse = new InvoiceOnlySaveResponse();

    this.invoice.invoiceOnlySave(invoiceRequest).subscribe((data) => {
      let userData = data;
      if (data !== undefined) {
        let customer = data;

      }
    });




  }
  onPrint() {
    alert('Print');
  }

}