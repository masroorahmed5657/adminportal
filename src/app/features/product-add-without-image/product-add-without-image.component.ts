import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Warehouse, ResponseFile, Category, Product, ProductView, Brands, ProductWrapper, AdminUser, WarehouseProducts, CodeMaster } from '../../shared/models/model-classes.model';
import { BrandsService } from '../../shared/services/brands.service';
import { CacheService } from '../../shared/services/cache.service';
import { CategoryService } from '../../shared/services/category.service';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { ProductsService } from '../../shared/services/products.service';
import { WarehouseService } from '../../shared/services/warehouse.service';
import Swal from "sweetalert2";
import { faPlusSquare, faDashboard, faRemove, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from "../../layouts/footer/footer.component";
import { Header2Component } from "../header2/header2.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@Component({
  selector: 'app-product-add-without-image',
  imports: [FooterComponent, Header2Component, ReactiveFormsModule, FontAwesomeModule, CommonModule],
  providers:[DatePipe],
  templateUrl: './product-add-without-image.component.html',
  styleUrl: './product-add-without-image.component.scss'
})

export class ProductAddWithoutImageComponent implements OnInit {

  warehouseList: Warehouse[] = [];
  faPlusSquare = faPlusSquare;
  currentPageNumber: number = 1;
  faDollar = faDollar;
  faRemove = faRemove;
  faHome = faHome;
  faSave = faSave;
  faDashboard = faDashboard;
  appName = environment.appName;

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

  selectedCategory: any;
  currentDepartment = '';
  editProduct: Product = new Product();

  myScan = '';
  myCode = '';
  //Documents
  selectedDocumentList: File[] = [];
  documentUrls: string[] = [];
  inputValue: string = 'CUTPRICE';
  inputValue1: string = 'HOTTREND';
  videoUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;

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
    unitName: new FormControl(),

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
    extraAttributes7: new FormControl(),
    cutprice: new FormControl(),
    hotprice: new FormControl(),
    tax: new FormControl()

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
    weight: new FormControl(0),
    madein: new FormControl(),
    upc: new FormControl(),
    sku: new FormControl(),
    brandId: new FormControl(),
    abbrName: new FormControl(),
    unitName: new FormControl(),
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
    extraAttributes7: new FormControl(),
    cutprice: new FormControl(),
    hotprice: new FormControl(),
    tax: new FormControl()

  });



  uploadForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    imgSrc: new FormControl('', [Validators.required])
  });

  submitted = false;
  spinnerDataLoad = false;

  warehouseForm = new FormGroup({
    warehouseId: new FormControl(),
    productId: new FormControl(),
    wFloor: new FormControl(),
    wAisle: new FormControl(),
    wRow: new FormControl(),
    wBin: new FormControl(),
    fromWarehouseId: new FormControl(),
    quantity: new FormControl(),
    intransitFlag: new FormControl(),
    shipmentMode: new FormControl(),
    updatedBy: new FormControl(),
    updatedDate: new FormControl(),
  })
  latestData: any = '';
  private interval: any;



  /* ************************ METHODS SECTION ************************* */
  constructor(private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductsService,
    private uploadService: FileUploadService,
    private brandsService: BrandsService,
    private WarehouseService: WarehouseService,
    private categoryService: CategoryService,
    private datepipe: DatePipe,
    private http: HttpClient,
  ) { }


  /* ******************************************************************* */
  ngOnInit(): void {

    // this.interval = setInterval(() => {
    //   this.fetchdata();
    //   this.latestData = ""
    // }, 3000)


    window.scrollTo(0, 0);
    this.productImageViewList.length = 0;
    this.documentViewList.length = 0;
    this.spinnerDataLoad = true;
    this.meatFlag = false;

    this.brandsService.getBrandsList().subscribe((data: Brands[]) => {
      this.brandsList = data;
      this.brandsList.sort();

    });

    this.WarehouseService.getWareHouseList().subscribe((data: Warehouse[]) => {
      this.warehouseList = data;

    });

    //Get Category List
    this.categoryService.getCategoryList().subscribe((data: Category[]) => {
      this.categoryList = data;

      this.categoryList.sort();

    });

  }
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

  /* ********************************************************************** */
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

  /* ********************************************************************** */
  onCancel() {
    this.productForm.reset();
    this.refreshList();
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

  /* *********************************************************************** */
  showList() {
    this.addFlag = false;
    this.editFlag = false;
    this.listFlag = true;
    window.scrollTo(0, 0);
  }

  /* *********************************************************************** */
  productDecorator(productList: ProductView[]): any {
    //find out make and model
    //this.productViewList = productList;
    let myCategory: Category;
    for (let i = 0; i < productList.length; i++) {
      this.productViewList[i] = new ProductView();

      myCategory = this.getCategoryName(productList[i].categoryId);

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
      this.productViewList[i].abbrName = productList[i].abbrName;
      this.productViewList[i].unitName = productList[i].unitName;


      //Added on Feb 25, 2024
      this.productViewList[i].qtyCase = productList[i].qtyCase;



      let expiryDate = this.datepipe.transform(productList[i].expiryDate, "yyyy-MM-dd");
      this.productViewList[i].expiryDate = expiryDate;


      /************************************** */
      this.productViewList[i].popularFlag = productList[i].popularFlag;
      this.productViewList[i].sellinPcs = productList[i].sellinPcs;
      this.productViewList[i].instockFlag = productList[i].instockFlag;
      //Just for safe side
      this.productViewList[i].productImage = productList[i].productImage;
      this.productViewList[i].imageMimeType = productList[i].imageMimeType;

    }
    return this.productViewList;
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
    product.unitName = this.productForm.get('unitName')?.value;

    //Added on Feb 25, 2024
    product.qtyCase = this.productForm.get('qtyCase')?.value;
    product.expiryDate = this.productForm.get('expiryDate')?.value;


    product.cuttingAttributes = this.getAttributes('cuttingAttributes');
    product.packagingAttributes = this.getAttributes('packagingAttributes');
    product.optionsAttributes = this.getAttributes('optionsAttributes');
    product.extraAttributes = this.getAttributes('extraAttributes');
    product.tax = this.productForm.get('tax')?.value;

    return product;
  }

  /* *********************************************************************** */
  convertFormToWarehouse(productId: any): WarehouseProducts {
    let warehouse = new WarehouseProducts();

    warehouse.warehouseId = this.warehouseForm.get('warehouseId')?.value;
    warehouse.productId = this.warehouseForm.get('productId')?.value;
    warehouse.wFloor = this.warehouseForm.get('wFloor')?.value;
    warehouse.wAisle = this.warehouseForm.get('wAisle')?.value;
    warehouse.wRow = this.warehouseForm.get('wRow')?.value;
    warehouse.wBin = this.warehouseForm.get('wBin')?.value;
    warehouse.fromWarehouseId = this.warehouseForm.get('fromWarehouseId')?.value;
    warehouse.quantity = this.warehouseForm.get('quantity')?.value;
    warehouse.intransitFlag = (this.warehouseForm.get('intransitFlag')?.value ? 1 : 0);
    warehouse.shipmentMode = this.warehouseForm.get('shipmentMode')?.value;

    let loggedInUser = new AdminUser();
    loggedInUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    warehouse.updatedBy = loggedInUser.loginId;
    warehouse.updatedDate = this.warehouseForm.get('updatedDate')?.value;
    return warehouse;
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
  /* ********************************************************************** */
  changeFileName(file: File, fileNumber: number): File {
    let fileName = file.name;
    let fileNameExt = fileName.split('.').pop();

    fileName = fileNumber + '.' + fileNameExt;

    let blob = file.slice(0, file.size, file.type);
    let newFile = new File([blob], fileName, { type: file.type });

    return newFile;
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
          let totalImageCount = 0;
          if (this.productImageViewList.length > 0) {
            totalImageCount = this.productImageViewList.length;
          }


          for (let i = 0; i < this.fileList.length; i++) {
            this.fileList[i] = this.changeFileName(this.fileList[i], totalImageCount + 1);
            totalImageCount++;
            this.uploadService.uploadFtp(this.fileList[i], productId).subscribe({
              next: (event: any) => {
              }
            });
          }//for loop
          /********************************** FILE UPLOAD ********************************************** */

        }
        /********************************** VIDEO UPLOAD ********************************************** */
        if (this.fileList && this.fileList.length > 0) {
          const file = this.fileList[0];
          const productId = data.productId; // Assuming you have productId available here
          // this.uploadService.uploadVideo(file, productId).subscribe({
          //   next: (event: any) => {
          //     // Handle success
          //   },
          //   error: (error: any) => {
          //     console.error('Error uploading video:', error);
          //     // Handle error
          //   }
          // });
        }

        /********************************** VIDEO UPLOAD ********************************************** */


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
        /********************************** WAREHOUSE ********************************************** */
        if (!this.warehouseForm.valid) { //Swal.fire('Submit', ' ' + productId + ' Succesfully!', 'success')
          return;
        }
        let warehouse: WarehouseProducts = this.convertFormToWarehouse(productId);
        if (warehouse.warehouseId !== null) {
          this.WarehouseService.saveWareHouseProduct(warehouse).subscribe(data => {
            let warehouseData = data.warehouse;
          });

        }

        /********************************** WAREHOUSE END  ********************************************** */
        this.alertWithSuccess(productId);
        // this.resetImageProgressSection();
        // this.fileList.length=0;
        // this.selectedDocumentList.length=0;
        // this.onReset();
        // this.refreshList();
        this.router.navigate(['products']);

      });

  }//onSubmit()
  /* *********************************************************************** */

  alertWithSuccess(productId: any) {
    Swal.fire('Submit', 'You have saved Product ' + productId + ' Succesfully!', 'success');
  }


  /* ******************************************************************* */
  onReset(): void {
    this.productForm.reset();
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

        if (file.size > 1965000) {
          Swal.fire('File Too Big', 'Image is too big to upload. Please resize to max 1965000KB');
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

  /* ********************************************************************** */
  backToList() {

    this.router.navigate(['products']);

  }

  /* ********************************************************************** */
  backToHome() {

    this.router.navigate(['home']);

  }



  /* ********************************************************** */
  removeImage(imageId: any) {

    let buttonElementId = 'myRemoveButton-' + imageId;
    let myRemoveButton = <HTMLButtonElement>(document.getElementById(buttonElementId));
    myRemoveButton.setAttribute('hidden', 'hidden');

  }

  /* ********************************************************** */
  removeDocument(docId: any) {

    //Remove current product Image

    let buttonElementId = 'myDocRemoveButton-' + docId;
    let myRemoveButton = <HTMLButtonElement>(document.getElementById(buttonElementId));
    myRemoveButton.setAttribute('hidden', 'hidden');


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
  onCheckboxChange(event: any) {
    this.inputValue = event.target.checked ? 'CUTPRICE' : '';
    this.productAddForm.controls['optionsAttributes1'].setValue('CUTPRICE');
  }
  /* ********************************************************** */
  onCheckboxChange1(event: any) {
    this.inputValue1 = event.target.checked ? 'HOTTREND' : '';
    this.productAddForm.controls['optionsAttributes2'].setValue('CUTPRICE');
  }

  fetchdata() {
    this.http.get('assets/cap.txt', { responseType: 'text' }).subscribe((data) => {
      const lines = data.split('\n');
      const latestData = lines[lines.length - 1];
      this.latestData = latestData.slice(-12).trim();
    });
  }

  onFileSelected(event: any) {
    let files: FileList = event.target.files;
    if (files.length > 1) {
      Swal.fire('Error: You can only select one video file');
      return;
    }
    let file: File = files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.videoUrl = reader.result;
        this.errorMessage = null;
      };
    }
  }

  removeVideo() {
    this.videoUrl = null;
    this.errorMessage = null;
  }


}
