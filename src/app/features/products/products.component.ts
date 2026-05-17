import { CommonModule, DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, isEmpty, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseFile, Category, Product, ProductView, Brands, ProductWrapper, CodeMaster, AdminUser, ApiResponse, BarcodeResponse } from '../../shared/models/model-classes.model';
import { BrandsService } from '../../shared/services/brands.service';
import { CacheService } from '../../shared/services/cache.service';
import { CategoryService } from '../../shared/services/category.service';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { ProductsService } from '../../shared/services/products.service';
import { faSortAlphaUp, faPrint, faUpload, faBarcode, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { BarcodesService } from '../../shared/services/barcodes.service';



@Component({
  selector: 'app-products',
  imports: [FontAwesomeModule, NgxPaginationModule, CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  projectName = environment.appName;
  showProductsList = environment.showProductsList;
  enabledEdit: any[] = [];
  currentUser: any;
  pageNo: number = 0;
  //pageSize = 10;
  sortOrder: string = 'asc';
  errorMsg = '';
  productTotalNumber = 0;
  // pageSize = environment.pageSize
  pageSize = 10

  sortField: any;

  showSimpleProduct= environment.showSimpleProduct;

  search: any;
  errorMessage: any = '';
  barcodeFlag = false;
  modalOpen: boolean = false;
  nameSearchModal: any = false;

  p: number = 1;
  faPlusSquare = faPlusSquare;
  currentPageNumber: number = 1;
  faDollar = faDollar;
  faRemove = faRemove;
  faHome = faHome;
  faSave = faSave;
  faDashboard = faDashboard;
  faUpload = faUpload;
  faBarcode = faBarcode;
  faPrint = faPrint;
  faSortAlphaUp = faSortAlphaUp;

  currentSearch: any = 'LAST';
  saleDiscount: any = 0;
  lowInventoryFlag = false;
  // variables for IMAGE tab
  selectedFiles?: FileList;
  currentFile: any;
  fileList: File[] = [];
  searchFlag = true;//default
  addFlag = false;
  editFlag = false;
  listFlag = true;
  meatFlag = false;
  /* All Images variables */
  progress = 0;
  message = '';
  preview = '';
  previewList: any[] = [];
  imageFlag = false;
  imgFile?: string;
  imageInfos?: Observable<any>;
  image: any;

  responseFile: ResponseFile[] = [];
  categoryList: Category[] = [];
  productList: Product[] = [];
  productViewList: ProductView[] = [];
  productImageViewList: ProductView[] = [];
  documentViewList: ResponseFile[] = [];

  brandsList: Brands[] = [];

  selectedCategory: any = '';
  currentDepartment = '';
  editProduct: Product = new Product();
  lowQuantity = 5;

  myScan = '';
  myCode = '';
  //Documents
  selectedDocumentList: File[] = [];
  documentUrls: string[] = [];

  selectedImportItems: File[] = [];

  allProducts: any[] = []

  productNotFound: boolean = false;


  /* ********************** FORMS Declaration ************************ */
  productForm: FormGroup = new FormGroup({
    productId: new FormControl(),
    custId: new FormControl(),
    productName: new FormControl('', [Validators.required]),
    productDetails: new FormControl('', [Validators.required]),
    unitPrice: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    discount: new FormControl(),
    popularFlag: new FormControl(),
    productStatus: new FormControl(),
    sellinPcs: new FormControl('1'),
    instockFlag: new FormControl(),
    purchasePrice: new FormControl(),
    quantity: new FormControl(),
    physicalDimension: new FormControl(),
    salePrice: new FormControl(),
    wholesalePrice: new FormControl(),
    weight: new FormControl(),
    madein: new FormControl(),
    upc: new FormControl(),
    sku: new FormControl(),
    brandId: new FormControl(),
    abbrName: new FormControl(),
    qtyCase: new FormControl(),
    expiryDate: new FormControl(),
    cuttingAttributes1: new FormControl(),
    cuttingAttributes2: new FormControl(),
    cuttingAttributes3: new FormControl(),
    cuttingAttributes4: new FormControl(),
    cuttingAttributes5: new FormControl(),
    cuttingAttributes6: new FormControl(),
    cuttingAttributes7: new FormControl(),

    packagingAttributes1: new FormControl(),
    packagingAttributes2: new FormControl(),
    packagingAttributes3: new FormControl(),
    packagingAttributes4: new FormControl(),
    packagingAttributes5: new FormControl(),
    packagingAttributes6: new FormControl(),
    packagingAttributes7: new FormControl(),

    optionsAttributes1: new FormControl(),
    optionsAttributes2: new FormControl(),
    optionsAttributes3: new FormControl(),
    optionsAttributes4: new FormControl(),
    optionsAttributes5: new FormControl(),
    optionsAttributes6: new FormControl(),
    optionsAttributes7: new FormControl(),

    extraAttributes1: new FormControl(),
    extraAttributes2: new FormControl(),
    extraAttributes3: new FormControl(),
    extraAttributes4: new FormControl(),
    extraAttributes5: new FormControl(),
    extraAttributes6: new FormControl(),
    extraAttributes7: new FormControl()
  });

  /* ************************** ADD Form *********************************** */
  productAddForm: FormGroup = new FormGroup({
    productId: new FormControl(),
    custId: new FormControl(),
    productName: new FormControl('', [Validators.required]),
    productDetails: new FormControl('', [Validators.required]),
    unitPrice: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    discount: new FormControl(),
    popularFlag: new FormControl(),
    productStatus: new FormControl(),
    sellinPcs: new FormControl('1'),
    instockFlag: new FormControl(),
    purchasePrice: new FormControl(),
    quantity: new FormControl(),
    physicalDimension: new FormControl(),
    salePrice: new FormControl(),
    wholesalePrice: new FormControl(),
    weight: new FormControl(),
    madein: new FormControl(),
    upc: new FormControl(),
    sku: new FormControl(),
    brandId: new FormControl(),
    abbrName: new FormControl(),
    qtyCase: new FormControl(),
    expiryDate: new FormControl(),

    cuttingAttributes1: new FormControl(),
    cuttingAttributes2: new FormControl(),
    cuttingAttributes3: new FormControl(),
    cuttingAttributes4: new FormControl(),
    cuttingAttributes5: new FormControl(),
    cuttingAttributes6: new FormControl(),
    cuttingAttributes7: new FormControl(),

    packagingAttributes1: new FormControl(),
    packagingAttributes2: new FormControl(),
    packagingAttributes3: new FormControl(),
    packagingAttributes4: new FormControl(),
    packagingAttributes5: new FormControl(),
    packagingAttributes6: new FormControl(),
    packagingAttributes7: new FormControl(),

    optionsAttributes1: new FormControl(),
    optionsAttributes2: new FormControl(),
    optionsAttributes3: new FormControl(),
    optionsAttributes4: new FormControl(),
    optionsAttributes5: new FormControl(),
    optionsAttributes6: new FormControl(),
    optionsAttributes7: new FormControl(),

    extraAttributes1: new FormControl(),
    extraAttributes2: new FormControl(),
    extraAttributes3: new FormControl(),
    extraAttributes4: new FormControl(),
    extraAttributes5: new FormControl(),
    extraAttributes6: new FormControl(),
    extraAttributes7: new FormControl()
  });



  uploadForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    imgSrc: new FormControl('', [Validators.required])
  });

  submitted = false;
  spinnerDataLoad = false;
  width: number = 190;
  height: number = 35;
  


  /* ************************ METHODS SECTION ************************* */
  constructor(private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductsService,
    private uploadService: FileUploadService,
    private brandsService: BrandsService,
    private categoryService: CategoryService,
    private datepipe: DatePipe,
    private barcodeService: BarcodesService
  ) { }

  /* ******************************************************************* */
  ngOnInit(): void {
    // Currency icon
    if (environment.currency === 'USD') {
      this.faDollar = faDollar;
    }
    else if (environment.currency === 'PKR') {
      this.faDollar = faRupeeSign;
    }
    else if (environment.currency === 'Rs') {
      this.faDollar = faRupeeSign;
    }

    // Current user
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }

    window.scrollTo(0, 0);
    this.productImageViewList.length = 0;
    this.documentViewList.length = 0;
    this.meatFlag = false;

    // Brands
    //this.brandsList = this.cache.getList("brandsList");
    //if (!this.brandsList) {
    this.brandsService.getBrandsList().subscribe((data: Brands[]) => {
      this.brandsList = data.sort();
      this.cache.setList("brandsList", this.brandsList);
    });
    //}

    // Categories
    //this.categoryList = this.cache.getList("categoryList");
    //if (!this.categoryList) 
    {
      this.categoryService.getCategoryList().subscribe((data: Category[]) => {
        this.categoryList = data.sort();
        this.cache.setList("categoryList", this.categoryList);

        let cat = this.cache.get('selectedCategory');
        let dept = this.cache.get('currentDepartment');

        this.selectedCategory = (cat && cat !== '') ? cat : ''; // Default -> All
        this.currentDepartment = (dept && dept !== '') ? dept : 'MEAT';
        if (this.currentDepartment === 'MEAT') this.meatFlag = true;

        this.productService.findTotalProductsCount().subscribe((data: any) => {
          this.productTotalNumber = data;
          this.loadProducts();
        });


      });
    }
    // else {
    //   let cat = this.cache.get('selectedCategory');
    //   let dept = this.cache.get('currentDepartment');

    //   this.selectedCategory = (cat && cat !== '') ? cat : ''; // Default -> All
    //   this.currentDepartment = (dept && dept !== '') ? dept : 'MEAT';
    //   if (this.currentDepartment === 'MEAT') this.meatFlag = true;

    //   this.selectedCategory = ''; // Force reset to All every time
    //   this.cache.set('selectedCategory', ''); // Cache bhi clear
    //   this.loadProducts();
    // }
  }
  /* ************************************************************* */

  totalPages: number = 0;


  // alag function banaya products load karne ke liye
  loadProducts() {
    this.spinnerDataLoad = true;
    this.allProducts.length=0;
    this.productViewList.length=0;

    this.productService.getFirstLatestProducts(this.pageSize, this.pageNo).subscribe((data: ProductView[]) => {
      let myData = data;
      //this.productTotalNumber = myData.length;//;.totalProductCount;
      this.totalPages = Math.ceil(this.productTotalNumber / this.pageSize);

      // backup list banai
      this.allProducts = this.productDecorator(myData);

      // table wali list copy
      this.productViewList = [...this.allProducts];

      //Get Barcodes also
      for (let i = 0; i < this.productViewList.length; i++) {
        let barCode = this.productViewList[i].upc;
        if (barCode == "" || barCode == null) {
          //Swal.fire("Numeric UPC Content is required to generate the 2D barcode");
          this.imageFlag = false;
          continue;//just ignore the product which does not have UPC

        }

        this.barcodeService.get2DBarCode8WithSize(barCode, this.width, this.height).subscribe((data: BarcodeResponse) => {
          this.productViewList[i].firstImage = data.image;


        });
        //this.htmlToPrintBarcode();

      }//for loop




      this.spinnerDataLoad = false;
    });
  }


  /* ******************************************************************* */
  onReset(): void {
    this.productForm.reset();
  }

  /* ******************************************************************* */
  //This methods is used in Edit mode when data came from DB
  convertProductToForm(product: Product) {
    this.productForm.get('productId')?.setValue(product.productId);
    this.productForm.get('custId')?.setValue(product.custId);
    this.productForm.get('productName')?.setValue(product.productName);
    this.productForm.get('productDetails')?.setValue(product.productDetails);
    this.productForm.get('unitPrice')?.setValue(product.unitPrice);
    this.productForm.get('categoryId')?.setValue(product.categoryId);
    this.productForm.get('discount')?.setValue(product.discount);
    this.productForm.get('popularFlag')?.setValue(product.popularFlag);
    this.productForm.get('productStatus')?.setValue(product.productStatus);
    this.productForm.get('madein')?.setValue(product.madein);
    this.productForm.get('instockFlag')?.setValue(product.instockFlag);
    this.productForm.get('sellinPcs')?.setValue(product.sellinPcs);
    this.productForm.get('wholesalePrice')?.setValue(product.wholesalePrice);
    this.productForm.get('salePrice')?.setValue(product.salePrice);
    this.productForm.get('purchasePrice')?.setValue(product.purchasePrice);
    this.productForm.get('physicalDimension')?.setValue(product.physicalDimension);
    this.productForm.get('quantity')?.setValue(product.quantity);
    this.productForm.get('weight')?.setValue(product.weight);
    this.productForm.get('upc')?.setValue(product.upc);
    this.productForm.get('sku')?.setValue(product.sku);
    this.productForm.get('brandId')?.setValue(product.brandId);
    this.productForm.get('abbrName')?.setValue(product.abbrName);
    //Added on Feb 25
    this.productForm.get('qtyCase')?.setValue(product.qtyCase);
    this.productForm.get('expiryDate')?.setValue(product.expiryDate);


    if (product.cuttingAttributes !== undefined) {
      if (product.cuttingAttributes !== '') {
        this.convertAttributes('cuttingAttributes', JSON.parse(product.cuttingAttributes));
      }
    }
    if (product.packagingAttributes !== undefined) {
      if (product.packagingAttributes !== '') {
        this.convertAttributes('packagingAttributes', JSON.parse(product.packagingAttributes));
      }
    }
    if (product.extraAttributes !== undefined) {
      if (product.extraAttributes !== '') {
        this.convertAttributes('extraAttributes', JSON.parse(product.extraAttributes));
      }
    }
    if (product.optionsAttributes !== undefined) {
      if (product.optionsAttributes !== '') {
        this.convertAttributes('optionsAttributes', JSON.parse(product.optionsAttributes));
      }
    }


    //this.productImageViewList.push(product);

  }
  /* *********************************************************************** */
  convertAttributes(name: string, attributes: CodeMaster[]) {
    if (attributes !== null) {
      for (let i = 0; i < attributes.length; i++) {
        this.productForm.get(name + (i + 1))?.setValue(attributes[i].description);

      }


    }

  }

  /* *********************************************************************** */
  //This method is used to convert Form data to Product Object.
  convertFormToProduct(): Product {
    let product = new Product();

    product.productId = this.productForm.get('productId')?.value;
    product.custId = this.productForm.get('custId')?.value;
    product.productName = this.productForm.get('productName')?.value;
    product.productDetails = this.productForm.get('productDetails')?.value;
    product.categoryId = this.productForm.get('categoryId')?.value;
    product.discount = this.productForm.get('discount')?.value;
    product.unitPrice = this.productForm.get('unitPrice')?.value;
    product.popularFlag = (this.productForm.get('popularFlag')?.value ? 1 : 0);
    product.productStatus = (this.productForm.get('productStatus')?.value ? 'A' : 'N');

    let loggedInUser = new AdminUser();
    loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    product.updatedBy = loggedInUser.loginId;

    product.madein = this.productForm.get('madein')?.value;
    product.instockFlag = (this.productForm.get('instockFlag')?.value ? 1 : 0);
    product.sellinPcs = (this.productForm.get('sellinPcs')?.value ? 1 : 0);
    product.wholesalePrice = this.productForm.get('wholesalePrice')?.value;
    product.quantity = this.productForm.get('quantity')?.value;
    product.physicalDimension = this.productForm.get('physicalDimension')?.value;
    product.weight = this.productForm.get('weight')?.value;
    product.purchasePrice = this.productForm.get('purchasePrice')?.value;
    product.salePrice = this.productForm.get('salePrice')?.value;
    product.upc = this.productForm.get('upc')?.value;
    product.sku = this.productForm.get('sku')?.value;
    product.brandId = this.productForm.get('brandId')?.value;
    product.abbrName = this.productForm.get('abbrName')?.value;

    //Added on Feb 25
    product.qtyCase = this.productForm.get('qtyCase')?.value;
    product.expiryDate = this.productForm.get('expiryDate')?.value;


    product.cuttingAttributes = this.getAttributes('cuttingAttributes');
    product.packagingAttributes = this.getAttributes('packagingAttributes');
    product.optionsAttributes = this.getAttributes('optionsAttributes');
    product.extraAttributes = this.getAttributes('extraAttributes');

    return product;
  }
  /* *********************************************************************** */
  getAttributes(name: string) {
    /* **************  Add Attributes *********** */
    let cuttingList: CodeMaster[] = [];

    for (let i = 1; i < 8; i++) {
      let data: CodeMaster = new CodeMaster();
      let c = this.productForm.get(name + i)?.value;
      if (c != null) {
        data.code = (i).toString();
        data.description = c;

        cuttingList.push(data);
      }
    }

    return JSON.stringify(cuttingList);

  }
  /* *********************************************************************** */
  convertCheckBoxToString(chkBox: any) {
    let retCode = '';
    if (chkBox !== null) {
      if (chkBox) {
        retCode = 'YES';
      }
      else {
        retCode = 'NO';
      }
    }
    else {
      retCode = 'NO';
    }
    return retCode;
  }
  /* *********************************************************************** */
  refreshList() {
    this.productImageViewList.length = 0;
    this.documentViewList.length = 0;
    this.showList();

    //Get all Products
    this.productService.getProducts(this.selectedCategory).subscribe((data: ProductWrapper) => {
      let myData = data;
      this.productViewList = this.productDecorator(myData.productList);


    });
  }
  /* ********************************************************************** */
  onCancel() {
    this.productForm.reset();
    this.refreshList();
  }

  /* *********************************************************************** */
  onSubmit() {
    this.submitted = true;

    this.fileList;
    //return;


    if (!this.productForm.valid) {
      //Swal.fire('Submit', ' ' + productId + ' Succesfully!', 'success')
      return;
    }
    let product: Product = this.convertFormToProduct();


    this.productService.saveProduct(product)
      .subscribe(data => {
        let productId = data.productId;

        /*************************** FILE UPLOAD **************************************************** */
        //Now save Image
        if (this.fileList.length > 0) {
          for (let i = 0; i < this.fileList.length; i++) {

            this.uploadService.upload(this.fileList[i], productId).subscribe({
              next: (event: any) => {
              }
            });
          }//for loop
          /********************************** FILE UPLOAD ********************************************** */

        }
        /********************************** DOCUMENT UPLOAD ********************************************** */
        if (this.selectedDocumentList.length > 0) {
          for (let j = 0; j < this.selectedDocumentList.length; j++) {
            this.uploadService.uploadDocument(this.selectedDocumentList[j], productId).subscribe({
              next: (event: any) => {

              },
              error: (err: any) => {
                console.log(err);
                this.progress = 0;

                if (err.error && err.error.message) {
                  this.message = err.error.message;
                } else {
                  this.message = 'Could not upload the Document! [' + j + ']';
                }

                this.currentFile = undefined;
              }

            });
          }//for loop
        }//end if
        /********************************** DOCUMENT UPLOAD ********************************************** */
        this.alertWithSuccess(productId);
        this.resetImageProgressSection();
        this.fileList.length = 0;
        this.selectedDocumentList.length = 0;
        this.onReset();
        this.refreshList();


      });

  }//onSubmit()
  /* *********************************************************************** */

  alertWithSuccess(productId: any) {
    Swal.fire('Submit', 'You have saved Product ' + productId + ' Succesfully!', 'success');
  }
  /* *********************************************************************** */
  onAddProduct() {

    if (this.showSimpleProduct){
      this.router.navigate(['/layout/products-simple-add']);
    }
    else{
      this.router.navigate(['/layout/products-master-add']);
    }
    

    //this.showNew();
    // window.scrollTo(0,0);
    // this.cache.set('productId', null);
    // this.productForm.reset();
    // this.productImageViewList.length=0;
    // this.documentViewList.length=0;

    // this.showAdd();

  }
  /* *********************************************************************** */

  onEditProduct(product: any) {

    if (this.showSimpleProduct){
      let url = '/layout/products-simple-edit/' + product.productId;
      this.router.navigate([url]);

    }
    else{
      let url = '/layout/products-master-edit/' + product.productId;
      this.router.navigate([url]);

    }
    





  }

  /* *********************************************************************** */
  productDecorator(productList: ProductView[]): any {
    //find out make and model
    //this.productViewList = productList;
    let myCategory: Category;
    let myBrand: Brands;

    for (let i = 0; i < productList.length; i++) {
      this.productViewList[i] = new ProductView();

      myCategory = this.getCategoryName(productList[i].categoryId);
      myBrand = this.getBrandName(productList[i].brandId);

      this.productViewList[i].category = myCategory.category;
      this.productViewList[i].categoryId = productList[i].categoryId;
      this.productViewList[i].subCategory = myCategory.subCategory;
      this.productViewList[i].productId = productList[i].productId;
      this.productViewList[i].productName = productList[i].productName;
      this.productViewList[i].productDetails = productList[i].productDetails;
      this.productViewList[i].custId = productList[i].custId;
      this.productViewList[i].unitPrice = productList[i].unitPrice;
      this.productViewList[i].discount = productList[i].discount;
      this.productViewList[i].popularFlag = productList[i].popularFlag;
      this.productViewList[i].productStatus = productList[i].productStatus;
      this.productViewList[i].packagingAttributes = productList[i].packagingAttributes;
      this.productViewList[i].cuttingAttributes = productList[i].cuttingAttributes;
      this.productViewList[i].extraAttributes = productList[i].extraAttributes;
      this.productViewList[i].optionsAttributes = productList[i].optionsAttributes;

      /*
            this.convertAttributes('cuttingAttributes', JSON.parse(productList[i].cuttingAttributes));
            this.convertAttributes('packagingAttributes', JSON.parse(productList[i].packagingAttributes));
            this.convertAttributes('extraAttributes', JSON.parse(productList[i].extraAttributes));
            if (productList[i].optionsAttributes!==undefined){
              this.convertAttributes('optionsAttributes', JSON.parse(productList[i].optionsAttributes));
            }
        */

      /************************************** */
      this.productViewList[i].purchasePrice = productList[i].purchasePrice;
      this.productViewList[i].quantity = productList[i].quantity;
      this.productViewList[i].physicalDimension = productList[i].physicalDimension;
      this.productViewList[i].wholesalePrice = productList[i].wholesalePrice;
      this.productViewList[i].salePrice = productList[i].salePrice;
      this.productViewList[i].weight = productList[i].weight;
      this.productViewList[i].madein = productList[i].madein;
      this.productViewList[i].sku = productList[i].sku;
      this.productViewList[i].upc = productList[i].upc;
      this.productViewList[i].brandId = productList[i].brandId;
      this.productViewList[i].brandCode = myBrand.brandCode;
      this.productViewList[i].abbrName = productList[i].abbrName;

      //Added on Feb 25, 2024
      this.productViewList[i].qtyCase = productList[i].qtyCase;

      let expiryDate: any = this.datepipe.transform(productList[i].expiryDate, "yyyy-MM-dd");

      this.productViewList[i].expiryDate = expiryDate;

      /************************************** */
      this.productViewList[i].popularFlag = productList[i].popularFlag;
      this.productViewList[i].sellinPcs = productList[i].sellinPcs;
      this.productViewList[i].instockFlag = productList[i].instockFlag;
      //Just for safe side
      this.productViewList[i].productImage = productList[i].productImage;
      this.productViewList[i].imageMimeType = productList[i].imageMimeType;
      this.productViewList[i].firstImage = productList[i].firstImage;
      this.productViewList[i].tax = productList[i].tax;
      this.productViewList[i].hsn = productList[i].hsn;

    }
    return this.productViewList;
  }

  /* ************************************************************************* */
  productDecorator2(productList: ProductView): any {
    //find out make and model
    //this.productViewList = productList;
    let myCategory: Category;
    let myBrand: Brands;


    let productViewList = new ProductView();

    myCategory = this.getCategoryName(productList.categoryId);
    myBrand = this.getBrandName(productList.brandId);

    productViewList.category = myCategory.category;
    productViewList.categoryId = productList.categoryId;
    productViewList.subCategory = myCategory.subCategory;
    productViewList.productId = productList.productId;
    productViewList.productName = productList.productName;
    productViewList.productDetails = productList.productDetails;
    productViewList.custId = productList.custId;
    productViewList.unitPrice = productList.unitPrice;
    productViewList.discount = productList.discount;
    productViewList.popularFlag = productList.popularFlag;
    productViewList.productStatus = productList.productStatus;
    productViewList.packagingAttributes = productList.packagingAttributes;
    productViewList.cuttingAttributes = productList.cuttingAttributes;
    productViewList.extraAttributes = productList.extraAttributes;
    productViewList.optionsAttributes = productList.optionsAttributes;

    /*
          this.convertAttributes('cuttingAttributes', JSON.parse(productList[i].cuttingAttributes));
          this.convertAttributes('packagingAttributes', JSON.parse(productList[i].packagingAttributes));
          this.convertAttributes('extraAttributes', JSON.parse(productList[i].extraAttributes));
          if (productList[i].optionsAttributes!==undefined){
            this.convertAttributes('optionsAttributes', JSON.parse(productList.optionsAttributes));
          }
      */

    /************************************** */
    productViewList.purchasePrice = productList.purchasePrice;
    productViewList.quantity = productList.quantity;
    productViewList.physicalDimension = productList.physicalDimension;
    productViewList.wholesalePrice = productList.wholesalePrice;
    productViewList.salePrice = productList.salePrice;
    productViewList.weight = productList.weight;
    productViewList.madein = productList.madein;
    productViewList.sku = productList.sku;
    productViewList.upc = productList.upc;
    productViewList.brandId = productList.brandId;
    productViewList.brandCode = myBrand.brandCode;
    productViewList.abbrName = productList.abbrName;

    //Added on Feb 25, 2024
    productViewList.qtyCase = productList.qtyCase;

    let expiryDate: any = this.datepipe.transform(productList.expiryDate, "yyyy-MM-dd");

    productViewList.expiryDate = expiryDate;

    /************************************** */
    productViewList.popularFlag = productList.popularFlag;
    productViewList.sellinPcs = productList.sellinPcs;
    productViewList.instockFlag = productList.instockFlag;
    //Just for safe side
    productViewList.productImage = productList.productImage;
    productViewList.imageMimeType = productList.imageMimeType;
    productViewList.firstImage = productList.firstImage;
    productViewList.tax = productList.tax;
    productViewList.hsn = productList.hsn;


    return productViewList;
  }


  /* *********************************************************************** */
  getCategoryName(categoryId: any): Category {
    let category: Category = new Category();
    for (let i = 0; i < this.categoryList.length; i++) {
      if (categoryId === this.categoryList[i].categoryId) {
        category.category = this.categoryList[i].category;
        category.subCategory = this.categoryList[i].subCategory;

        break;
      }
    }

    return category;
  }

  /* *********************************************************************** */
  getBrandName(brandId: any): Brands {
    let brand: Brands = new Brands();
    for (let i = 0; i < this.brandsList.length; i++) {
      if (brandId === this.brandsList[i].brandId) {
        brand.brandCode = this.brandsList[i].brandCode;
        brand.brandName = this.brandsList[i].brandName;

        break;
      }
    }

    return brand;
  }

  /* ********************** IMAGE Methods ******************************* */
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    let myRemoveButton = <HTMLButtonElement>(document.getElementById('myRemoveButton'));
    if (myRemoveButton !== null) {
      myRemoveButton.removeAttribute('hidden');
    }


    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;
        this.fileList.push(file);
        if (file.size > 65000) {
          Swal.fire('File Too Big', 'Image is too big to upload. Please resize to max 65KB');
          this.currentFile = '';
          this.message = '';
          this.preview = '';
          this.progress = 0;

          return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
          //console.log(e.target.result);
          this.previewList.push(e.target.result);
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  /* ******************************************************************** */
  upload(): void {
    //This upload will work only in EDIT mode. For Add, must do in one transaction
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        let productId = this.cache.get('productId');
        if (productId != null) {
          this.uploadService.upload(this.currentFile, this.cache.get('productId')).subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                this.imageInfos = this.uploadService.getFiles(productId);
              }
            },
            error: (err: any) => {
              console.log(err);
              this.progress = 0;

              if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = 'Could not upload the image!';
                Swal.fire('Error', 'Could not upload the image!');
              }

              this.currentFile = undefined;
            },
          });
        }

      }

      this.selectedFiles = undefined;
    }

  }
  /* *********************************************************************** */
  showAdd() {
    this.addFlag = true;
    this.editFlag = false;
    this.listFlag = false;
    this.onReset();
    this.resetImageProgressSection();
    this.productViewList.length = 0;
    window.scrollTo(0, 0);
  }
  /* *********************************************************************** */
  showEdit() {
    this.addFlag = false;
    this.editFlag = true;
    this.listFlag = false;
    window.scrollTo(0, 0);
  }
  /* *********************************************************************** */
  showList() {
    this.addFlag = false;
    this.editFlag = false;
    this.listFlag = true;
    window.scrollTo(0, 0);
  }
  /* *********************************************************************** */
  get f(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }

  /* *********************************************************************** */

  resetImageProgressSection() {
    //this.selectedFiles: FileList;
    this.currentFile;
    this.progress = 0;
    this.message = '';
    this.preview = '';

  }
  /* **************************************************** */
  // Category change
  categoryChange(): void {
    this.spinnerDataLoad = true;

    if (!this.selectedCategory) {
      // All selected
      this.cache.set('selectedCategory', ''); // Cache update karo
      this.productService.getFirstLatestProducts(this.pageSize, this.pageNo)
        .subscribe((data: ProductView[]) => {
          //this.productTotalNumber = data.length; //totalProductCount;
          this.productViewList = this.productDecorator(data);
          this.spinnerDataLoad = false;
        });
    } else {
      // Specific category selected
      const category = this.getCategoryName(this.selectedCategory);
      this.currentDepartment = category?.category || '';

      this.cache.set('selectedCategory', this.selectedCategory);
      this.cache.set('currentDepartment', this.currentDepartment);

      this.productViewList.length = 0;
      this.productImageViewList.length = 0;
      this.documentViewList.length = 0;

      this.productService.getProducts(this.selectedCategory)
        .subscribe((data: ProductWrapper) => {
          this.productViewList = this.productDecorator(data.productList);
          this.spinnerDataLoad = false;
        });
    }
  }


  /* ********************************************************** */
  deleteProduct(productId: any) {

    //Remove current product

    Swal.fire({
      title: 'Are you sure to delete this Product?',
      text: 'You can not recover Product!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {

      if (response.value) {

        this.productService.delete(productId).subscribe((data: any) => {
          window.location.reload();
        })

      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Product is safe',
          'error'
        )
      }
    });


  }

  // search inputs
  searchUPC: string = '';
  searchSKU: string = '';
  searchName: string = '';
  searchPrice: string = '';



  productSearch() {
    const upc = this.searchUPC ? this.searchUPC.trim().toLowerCase() : '';
    const sku = this.searchSKU ? this.searchSKU.trim().toLowerCase() : '';
    const name = this.searchName ? this.searchName.trim().toLowerCase() : '';
    const price = this.searchPrice ? this.searchPrice : null; // number hi rakho

    this.productViewList = this.allProducts.filter(item => {
      const itemUPC = item.upc ? item.upc.toString().toLowerCase() : '';
      const itemSKU = item.sku ? item.sku.toString().toLowerCase() : '';
      const itemName = item.productName ? item.productName.trim().toLowerCase() : '';
      const itemPrice = item.unitPrice ? item.unitPrice : null; // number hi rakho

      const matchesUPC = upc ? itemUPC.includes(upc) : true;
      const matchesSKU = sku ? itemSKU.includes(sku) : true;
      const matchesName = name ? itemName.includes(name) : true;
      const matchesPrice = price !== null ? itemPrice == price : true;

      return matchesUPC && matchesSKU && matchesName && matchesPrice;
    });
  }


  /* ********************************************* */
  chkNumber(col: string) {

    //let qtyInput  =  <HTMLInputElement> (document.getElementById(col));
    //let val2 = qtyInput.value;
    let val = this.productForm.get(col)?.value;

    if (val != null || val != undefined) {
      // let len = qtyInput.value.length;
      let len = val.toString().length;

      if (len > 6) {
        //qtyInput.value = qtyInput.value.toString().slice(0,2);
        this.productForm.get(col)?.setValue(val.toString().slice(0, 6));
      }

    }

  }//chkNumber

  /* ************************************************************** */
  categoryProductChange() {
    let obj = this.productForm.get('categoryId');
    if (obj !== null || obj !== undefined) {
      let catId = obj?.value;
      let catName = this.getCategoryName(Number(catId));
      if (catName.category === 'MEAT' || catName.category === 'QURBANI') {
        this.meatFlag = true;
      }
      else {
        this.meatFlag = false;
      }


    }
    let t1 = 0;
  }
  /* ******************************************************************** */

  upcSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const upc = input.value.trim();

    if (!upc) {
      // agar input empty ho to original list restore
      this.productNotFound = false;
      this.productViewList = [...this.allProducts];
      return;
    }

    this.spinnerDataLoad = true;

    this.productService.getProductsByUPC(upc).subscribe({
      next: (product) => {
        this.spinnerDataLoad = false;

        if (!product || !product.productId) {
          // Not found
          this.productNotFound = true;
          this.productViewList = [];
          return;
        }

        // Found
        this.productNotFound = false;
        this.productViewList = [this.productDecorator2(product)];
      },
      error: (err) => {
        this.spinnerDataLoad = false;
        console.error('UPC search error:', err);

        // Error case bhi "not found" jaisa treat
        this.productNotFound = true;
        this.productViewList = [];
      }
    });
  }



  /* ******************************************************* */

  upcSearchWindow(upc: any) {

    //let myScan='';
    //alert(upc);
    //alert(upc.length)

    if (upc !== undefined || upc !== '') {
      //serach product by UPC
      this.productService.getProductsByUPC(upc).subscribe(
        data => {
          if (data !== undefined) {
            this.productViewList.length = 0;
          }

          let productId = data.productId;
          //reset myscan
          this.myCode = '';
          this.myScan = '';

          if (productId === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist',
              'error'
            );
          }
          else if (productId !== null || productId !== undefined) {
            //if found the product, go to edit mode.
            this.onEditProduct(data);
          }

        }
      );

    }

  }


  /* ********************************************************** */
  onDocumentSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedDocumentList.push(files[i]);
    }
  }
  /* ********************************************************** */
  uploadDocuments() {
    this.documentUrls = [];
    for (const file of this.selectedDocumentList) {
      const reader = new FileReader();
      reader.onload = () => {
        this.documentUrls.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  /* ********************************************************** */
  removeImage(productId: any, imageId: any) {

    //Remove current product Image
    this.productService.deleteImage(productId, imageId).subscribe((data: any) => {
      this.resetImageProgressSection();
      this.productViewList.length = 0;
      this.productForm.get('productImage')?.setValue('');

      let buttonElementId = 'myRemoveButton-' + imageId;
      let myRemoveButton = <HTMLButtonElement>(document.getElementById(buttonElementId));
      myRemoveButton.setAttribute('hidden', 'hidden');

    }

    );


  }
  /* ********************************************************** */
  removeDocument(productId: any, docId: any) {

    //Remove current product Image
    this.productService.deleteDoc(productId, docId).subscribe((data: any) => {
      this.resetImageProgressSection();

      let buttonElementId = 'myDocRemoveButton-' + docId;
      let myRemoveButton = <HTMLButtonElement>(document.getElementById(buttonElementId));
      myRemoveButton.setAttribute('hidden', 'hidden');

    }

    );


  }

  /* ***************************************************** */
  discount() {

    let ret = 0;
    let product: Product = new Product();
    product.categoryId = this.selectedCategory;
    product.discount = this.saleDiscount;

    let loggedInUser = new AdminUser();
    loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    product.updatedBy = loggedInUser.loginId;


    alert('Discount: ' + product.discount + '  CatId:' + product.categoryId + '  Updated By:' + product.updatedBy);
    this.productService.discountProduct(product)
      .subscribe(data => {
        let response = data;

      });


  }



  /* ******************************************************************** */
  lowInventory() {
    //alert('Low Inventory:' + this.lowInventoryFlag);

    if (this.lowInventoryFlag) {
      this.productService.getLowInventoryProducts(this.selectedCategory, this.lowQuantity).subscribe((data: ProductWrapper) => {
        let myData = data;
        this.productViewList.length = 0;
        if (data != undefined) {
          if (myData.productList.length > 0) {

            this.productViewList = this.productDecorator(myData.productList);
          }


        }

        this.spinnerDataLoad = false;
      });

    }
    else {
      //Get all Products
      this.productService.getProducts(this.selectedCategory).subscribe((data: ProductWrapper) => {
        let myData = data;
        this.productViewList = this.productDecorator(myData.productList);
        this.spinnerDataLoad = false;
      });

    }

  }
  /* ********************************************* */
  chkDiscount() {


    if (this.saleDiscount < 0) {
      this.saleDiscount = 0;
    }
    if (this.saleDiscount > 99) {
      this.saleDiscount = 99;
    }

  }//chkDiscount

  importProducts() {


    // this.productService.importProducts().subscribe((data: ApiResponse) => {
    //   let myData = data;

    //   this.spinnerDataLoad = false;
    // });
  }

  /* ********************************************************************** */
  backToHome() {

    this.router.navigate(['home']);

  }
  /* ******************************************************************** */
  generateBarcode() {


    this.productService.generateBarCode().subscribe((data: ApiResponse) => {
      Swal.fire('BarCode', 'BarCode Generated Successfully', 'success');
    });
  }

  /* ******************************************************************** */
  closeModal() {
    this.modalOpen = false;
    //this.clearFields();
  }


  /* ************************************************************** */
  skuSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {

      this.currentSearch = 'SKU';
      this.clearSearch();

      let qtyInput = <HTMLInputElement>document.getElementById('sku-search');
      if (qtyInput === undefined) {
        return;
      }

      let sku = qtyInput.value;
      if (sku !== undefined || sku !== '') {
        if (sku.length === 0) {
          //Return for blank
          return;
        }
        //serach product by UPC
        this.productService.getProductsBySKU(sku).subscribe((data) => {
          let myData = data;
          if (data !== undefined) {
            this.productViewList.length = 0;
          }
          //this.productTotalNumber = myData.length;
          this.productViewList = this.productDecorator(myData);
          this.spinnerDataLoad = false;
          if (this.productViewList.length > 0) {
            this.cache.setList(
              'searchProducts',
              JSON.stringify(this.productViewList)
            );
            //this.cache.set('searchParam', this.search);
            //this.nameSearchModal = true;
          } else {
            this.errorMessage = 'No Record, No Record Found';

            setTimeout(() => {
              Swal.fire('No Record, No Record Found');
              this.showAlert();
            }, 6000);
          }
        });
      }
    }
  }


  /* ************************************************************** */
  priceSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      let qtyInput = <HTMLInputElement>document.getElementById('price-search');
      if (qtyInput === undefined) {
        return;
      }


      let price = qtyInput.value;
      this.currentSearch = 'PRICE';
      this.clearSearch();

      isEmpty()

      if (price !== undefined || price !== '') {
        if (price.length === 0) {
          //Return for blank
          return;
        }
        let currentPage = 0;
        if (this.pageNo > 0) {
          currentPage = this.pageNo - 1;
        }

        let pageSize = 100;//For now hard coded
        //serach product by UPC
        this.productService.getProductsByPrice(price, pageSize, currentPage).subscribe((data) => {
          //let productId = data.productId;
          this.productViewList.length = 0; //Reset Array
          this.productViewList = this.productDecorator(data.productList);
          this.spinnerDataLoad = false;
          if (this.productViewList.length > 0) {
            this.productTotalNumber = this.productViewList.length;
            this.cache.setList(
              'searchProducts',
              JSON.stringify(this.productViewList)
            );
            //this.cache.set('searchParam', this.search);
            //this.nameSearchModal = true;
          } else {
            this.errorMessage = 'No Record, No Record Found';

            setTimeout(() => {
              Swal.fire('No Record, No Record Found');
              this.showAlert();
            }, 6000);
          }

        });
      }
    } else {
      myScan = event.target.value;
    }
  }



  nameSearch(event: KeyboardEvent) {
    let s1 = event;
    if (event.key === 'Enter' || event.code === 'NumpadEnter') {
      this.currentSearch = 'NAME';
      this.clearSearch();
      this.onSearch();
    }
  }

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

    if (this.search.length === 0) {
      //Return for blank
      return;
    }

    this.productService.getSearchProducts(this.search)
      .subscribe((data: any) => {
        let myData = data;
        this.productViewList.length = 0; //reset
        this.productViewList = this.productDecorator(myData.productList);
        this.spinnerDataLoad = false;

        if (this.productViewList.length > 0) {
          this.productTotalNumber = this.productViewList.length;
          this.cache.setList(
            'searchProducts',
            JSON.stringify(this.productViewList)
          );
          //this.cache.set('searchParam', this.search);
          //this.nameSearchModal = true;
        } else {
          this.errorMessage = 'No Record, No Record Found';

          setTimeout(() => {
            Swal.fire('No Record, No Record Found');
            this.showAlert();
          }, 6000);
        }
      });
  }

  showAlert() {
    this.search = '';
    this.errorMessage = '';
  }

  /* *************************************************************** */
  closeNameSearchModal() {
    this.nameSearchModal = false;
  }

  uploadItems(event: any) {
    //alert('Upload Items');
    const files: FileList = event.target.files;
    this.spinnerDataLoad = true;

    this.selectedImportItems.push(files[0]);

    /********************************** DOCUMENT UPLOAD ********************************************** */
    if (this.selectedImportItems.length > 0) {
      for (let j = 0; j < this.selectedImportItems.length; j++) {
        this.productService.importProducts(this.selectedImportItems[j]).subscribe({
          next: (event: any) => {
            let status = event.status;
            let statusText = event.statusText;
            this.spinnerDataLoad = false;
            if (status === undefined) {
              this.spinnerDataLoad = false;
            }
            else if (status === 200) {
              Swal.fire('Success', 'Successfully Imported Items', 'success');
              window.location.reload();
            }
            else {
              Swal.fire('Fail', 'Import Failed Items', 'error');
              this.spinnerDataLoad = false;

            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            this.spinnerDataLoad = false;

            if (err.error && err.error.message) {
              this.message = err.error.message;

            } else {
              this.message = 'Could not upload the CSV Items! ';

            }

            this.currentFile = undefined;
          }

        });
      }//for loop
    }//end if

  }

  /* *************************************************** */

  bulkUpdate(event: any) {
    //alert('Upload Items');
    const files: FileList = event.target.files;

    this.spinnerDataLoad = true;

    this.selectedImportItems.push(files[0]);

    /********************************** DOCUMENT UPLOAD ********************************************** */
    if (this.selectedImportItems.length > 0) {
      for (let j = 0; j < this.selectedImportItems.length; j++) {
        this.uploadService.bulkUpdateCSVItems(this.selectedImportItems[j]).subscribe({
          next: (event: any) => {
            let status = event.status;
            let statusText = event.statusText;
            this.spinnerDataLoad = false;
            if (status === undefined) {

            }
            else if (status === 200) {
              Swal.fire('Success', 'Successfully Updated Items', 'success');
              window.location.reload();
            }
            else {
              Swal.fire('Fail', 'Import Failed Items', 'error');
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;

            } else {
              this.message = 'Could not upload the CSV Items! ';

            }

            this.currentFile = undefined;
          }

        });
      }//for loop
    }//end if



  }

  /* ***************************************************** */
  startEdit(row: any) {
    this.enabledEdit[row] = true;
  }

  edit(row: any) {
    this.onEditProduct(this.productViewList[row].productId);
  }

  onDelete(productId: any, row: any) {
    //let productId: any = this.productViewList[row].productId;


    Swal.fire({
      title: 'Are you sure to delete this Product?',
      text: 'You can not recover Product!!',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: false,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-2 right-gap',
        confirmButton: 'order-1'

      },
    }).then((response: any) => {

      if (response.value) {

        this.productService.delete(productId).subscribe((data: any) => {
          window.location.reload();
          //this.backToList();
        })

      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Product is safe',
          'error'
        )
      }
    });


  }


  onSave(productId: any, row: number) {
    if (!this.enabledEdit[row]) return;

    let product: Product = new Product();

    // Directly pick from ngModel (jo input me bind hai)
    product.productId = productId; //this.productViewList[row].productId;
    product.quantity = this.productViewList[row].quantity;
    product.purchasePrice = this.productViewList[row].purchasePrice;
    product.salePrice = this.productViewList[row].salePrice;
    product.tax = this.productViewList[row].tax;
    product.upc = this.productViewList[row].upc;
    // product.updatedBy = this.currentUser.loginId;

    this.productService.saveEditProduct(product).subscribe({
      next: (data) => {
        if (data) {
          Swal.fire('Submit', `You have saved Item ${data} successfully!`, 'success');
          this.enabledEdit[row] = false;  // disable edit after save
        } else {
          Swal.fire('Error', 'Error in saving Item', 'error');
        }
      },
      error: (err) => {
        console.error('Error saving product:', err);
        Swal.fire('Error', 'API Error while saving Item', 'error');
      }
    });
  }


  /****************pagination every click top change******************** */

  onPageChange(page: number) {
    // Scroll to the top of the page

    this.pageNo = page;

    let currentPage = 0;
    if (this.pageNo > 0) {
      currentPage = this.pageNo - 1;
    }
    //alert('Current Page:'+ currentPage + '    catId:' + this.selectedCategory);
    //Get all Products for selected Category
    //let pageNo = 0;

    this.spinnerDataLoad = true;
    //if (this.currentSearch === 'LAST') 
    {
      this.productService.getFirstLatestProducts(this.pageSize, currentPage).subscribe((data: ProductView[]) => {
        let myData = data;
        if (myData != undefined) {
          if (myData.length > 0) {
            this.productViewList = this.productDecorator(myData);
            //this.productTotalNumber = myData.length; //.totalProductCount;

            this.cache.setList('productMasterViewList', JSON.stringify(this.productViewList));

            //Default Sort Order
            //this.onSortOrderChange();

          }
          else {
            this.errorMsg = 'Items are out of Stock';
          }
          this.spinnerDataLoad = false;

          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

      });
    }
    // else if (this.currentSearch === 'PRICE') {

    // }
    // else if (this.currentSearch === 'UPC') {

    // }
    // else if (this.currentSearch === 'SKU') {

    // }
    // else if (this.currentSearch === 'NAME') {

    // }


  }

  clearSearch() {

    let nameInput = <HTMLInputElement>document.getElementById('name-search');
    let priceInput = <HTMLInputElement>document.getElementById('price-search');
    let skuInput = <HTMLInputElement>document.getElementById('sku-search');
    let upcInput = <HTMLInputElement>document.getElementById('upc-search');


    if (this.currentSearch === 'PRICE') {
      if (upcInput !== undefined) {
        upcInput.value = '';
      }
      if (skuInput !== undefined) {
        skuInput.value = '';
      }
      if (nameInput !== undefined) {
        nameInput.value = '';
      }

    }
    else if (this.currentSearch === 'UPC') {
      if (priceInput !== undefined) {
        priceInput.value = '';
      }
      if (skuInput !== undefined) {
        skuInput.value = '';
      }
      if (nameInput !== undefined) {
        nameInput.value = '';
      }
    }
    else if (this.currentSearch === 'SKU') {
      if (priceInput !== undefined) {
        priceInput.value = '';
      }
      if (upcInput !== undefined) {
        upcInput.value = '';
      }
      if (nameInput !== undefined) {
        nameInput.value = '';
      }

    }
    else if (this.currentSearch === 'NAME') {
      if (priceInput !== undefined) {
        priceInput.value = '';
      }
      if (skuInput !== undefined) {
        skuInput.value = '';
      }
      if (upcInput !== undefined) {
        upcInput.value = '';
      }

    }
  }

  /* ************************************************* */
  sortAsc: boolean = false;

  sort(colName: any) {
    if (colName === 'productName') {
      if (this.sortAsc) {
        this.productViewList.sort((a, b) => a.productName! > b.productName! ? 1 : a.productName! < b.productName! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.productViewList.sort((a, b) => a.productName! < b.productName! ? 1 : a.productName! > b.productName! ? -1 : 0);
        this.sortAsc = true;
      }
    }

    if (colName === 'quantity') {
      if (this.sortAsc) {
        this.productViewList.sort((a, b) => a.quantity! > b.quantity! ? 1 : a.quantity! < b.quantity! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.productViewList.sort((a, b) => a.quantity! < b.quantity! ? 1 : a.quantity! > b.quantity! ? -1 : 0);
        this.sortAsc = true;
      }
    }
    if (colName === 'purchasePrice') {
      if (this.sortAsc) {
        this.productViewList.sort((a, b) => a.purchasePrice! > b.purchasePrice! ? 1 : a.purchasePrice! < b.purchasePrice! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.productViewList.sort((a, b) => a.purchasePrice! < b.purchasePrice! ? 1 : a.purchasePrice! > b.purchasePrice! ? -1 : 0);
        this.sortAsc = true;
      }
    }
    if (colName === 'salePrice') {
      if (this.sortAsc) {
        this.productViewList.sort((a, b) => a.salePrice! > b.salePrice! ? 1 : a.salePrice! < b.salePrice! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.productViewList.sort((a, b) => a.salePrice! < b.salePrice! ? 1 : a.salePrice! > b.salePrice! ? -1 : 0);
        this.sortAsc = true;
      }
    }
    if (colName === 'brandCode') {
      if (this.sortAsc) {
        this.productViewList.sort((a, b) => a.brandCode! > b.brandCode! ? 1 : a.brandCode! < b.brandCode! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.productViewList.sort((a, b) => a.brandCode! < b.brandCode! ? 1 : a.brandCode! > b.brandCode! ? -1 : 0);
        this.sortAsc = true;
      }
    }
    if (colName === 'category') {
      if (this.sortAsc) {
        this.productViewList.sort((a, b) => a.category! > b.category! ? 1 : a.category! < b.category! ? -1 : 0);
        this.sortAsc = false;
      }
      else if (!this.sortAsc) {
        this.productViewList.sort((a, b) => a.category! < b.category! ? 1 : a.category! > b.category! ? -1 : 0);
        this.sortAsc = true;
      }
    }


  }

  /* ********************************************************** */
  printBarCode() {

    if (this.productViewList.length === 0) {
      Swal.fire('WARNING', 'No Product in List Available', 'error');
      return;
    }

    this.barcodeFlag = true;
    this.modalOpen = true;
  }


  printBarcodesOnPrinter2() {

    const width: number = 190;
    const height: number = 35;

    if (this.productViewList.length === 0) {
      Swal.fire('WARNING', 'No Product in List Available', 'error');
      return;
    }

    for (let i = 0; i < this.productViewList.length; i++) {
      let barCode = this.productViewList[i].upc;
      if (barCode == "" || barCode == null) {
        Swal.fire("Numeric UPC Content is required to generate the 2D barcode");
        this.imageFlag = false;
        continue;//just ignore the product which does not have UPC

      }

      this.barcodeService.get2DBarCode8WithSize(barCode, width, height).subscribe((data: BarcodeResponse) => {

        //Repeat same barcode for QTY mentioned
        let qty = this.productViewList[i].quantity;
        for (let j = 0; j < qty; j++) {

          this.productViewList[i].firstImage = data.image;
        }

      });
      this.htmlToPrintBarcode();

    }//for loop


  }

  htmlToPrintBarcode() {

    let htmlTag = `
    <html>
      <head>
        <title></title>
        <style>
           body { width: 5.1in; background:#e8e8e8; }
          
          .label{border: 0px solid black;
          width: 2.40in; height: 1.41in;   margin-right: .10in;  margin-bottom: .10in; 
          float: left; text-align: center; overflow: hidden; background:#fff; outline: 0px dotted #999;
          font-size: 22px; font-family: 'calibri';
          }
          .page-break { clear: left; display:block; page-break-after:always; }

          @media print {
            .hidden-print,
            .hidden-print * {
            display: none !important;
          }
          @page {
            margin-top: 0;
            margin-bottom: 0;
          }
          }
        </style>

      </head>
      <body onload="window.print();window.close()">`;

    let footerTag = ` </body>
    </html>`;

    let currencySign = '$';
    if (environment.currencyName === 'USD') {
      currencySign = '$';
    }
    else if (environment.currencyName === 'CAD') {
      currencySign = '$';
    }
    else if (environment.currencyName === 'PKR') {
      currencySign = 'Rs.';
    }



    let divTag = ``;
    for (let i = 0; i < this.productViewList.length; i++) {
      let product = this.productViewList[i];
      let len: any = 30;
      len = (product.productName)?.length;

      let fontSize = 12;
      let itemNameLabel = '';
      if (len < 30) {
        fontSize = 12;
        itemNameLabel = `<p style="margin-top: -0.5;font-size: 16px !important; font-family: 'Times New Roman';">` + product.productName +
          `(` + product.sku + `)</p>`;
      }
      else {
        fontSize = 11;
        itemNameLabel = `<p style="margin-top: -0.5;font-size: 13px !important; font-family: 'Times New Roman';">` + product.productName +
          `(` + product.sku + `)</p>`;
      }
      divTag = divTag + `<div class="label">` + itemNameLabel +

        // `<br>` +
        //`<p style="font-size:small; padding:0 0 0 0;  font-family: 'calibri'">` + product.sku + `</p>` +
        // `<br>` +                 
        `<img style="margin-top: -8;"  src='data:image/png;base64,` + product.firstImage + `'>
                 <br>`
        + `<label style="style="font-size:30px !important;font-weight: bolder;">` + product.upc + `</label>` +
        `<br> <label style="style="font-size:20px !important;font-weight: bolder;">
                  ` + currencySign + ` ` + (product.salePrice).toFixed(2) + `</label>` +

        `</div>
         
        `;

    }

    let finalTag = htmlTag + divTag + footerTag;
    // alert(finalTag);

    let popupWin = window.open('', '_blank');
    popupWin?.document.open();
    popupWin?.document.write(finalTag);

    popupWin?.document.close();
    //this.barCodePopup = false;
    this.barcodeFlag = true;
    this.modalOpen = true;

  }


  /* ******************************************* END OF COMPONENT ****************************** */
}//end of component
