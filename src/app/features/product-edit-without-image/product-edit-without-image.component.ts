import { CommonModule, DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Warehouse, ResponseFile, Category, Product, ProductView, ProductImage, Brands, CodeMaster, AdminUser, WarehouseProducts } from '../../shared/models/model-classes.model';
import { BrandsService } from '../../shared/services/brands.service';
import { CacheService } from '../../shared/services/cache.service';
import { CategoryService } from '../../shared/services/category.service';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { ProductsService } from '../../shared/services/products.service';
import { WarehouseService } from '../../shared/services/warehouse.service';
import { faPlusSquare, faRemove, faDollar, faRupeeSign, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { Header2Component } from "../header2/header2.component";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-product-edit-without-image',
  imports: [Header2Component, FooterComponent,FontAwesomeModule,CommonModule,ReactiveFormsModule],
  providers:[DatePipe],
  templateUrl: './product-edit-without-image.component.html',
  styleUrl: './product-edit-without-image.component.scss'
})

export class ProductEditWithoutImageComponent implements OnInit{

  warehouseList: Warehouse[] = [];
  faPlusSquare = faPlusSquare;
  currentPageNumber: number = 1;
  faDollar = faRupeeSign;
  faRemove = faRemove;
  faHome = faHome;
  faSave = faSave;
  appName = environment.appName;
  showImageFlag: boolean = environment.showImageFlag;
  showWarehouseFlag: boolean = environment.showWarehouseFlag;

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
  productImageViewList: ProductImage[] = [];
  documentViewList: ResponseFile[] = [];

  brandsList: Brands[] = [];

  selectedCategory: any;
  currentDepartment = '';
  editProduct: ProductView = new ProductView();

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
    unitName: new FormControl(),
    madein: new FormControl(),
    upc: new FormControl(),
    sku: new FormControl(),
    brandId: new FormControl(),
    abbrName: new FormControl(),
    qtyCase: new FormControl(),
    expiryDate: new FormControl(),

    tax: new FormControl(),

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
    unitName: new FormControl(),
    madein: new FormControl(),
    upc: new FormControl(),
    sku: new FormControl(),
    brandId: new FormControl(),
    abbrName: new FormControl(),

    qtyCase: new FormControl(),
    expiryDate: new FormControl(),
    tax: new FormControl(),
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
  errorMsg = '';



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

  /* ************************ METHODS SECTION ************************* */
  constructor(private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductsService,
    private uploadService: FileUploadService,
    private brandsService: BrandsService,
    private WarehouseService: WarehouseService,
    private categoryService: CategoryService,
    private datepipe: DatePipe
  ) { }

  /* ******************************************************************** */
  ngOnInit(): void {
    let productId: number = Number(this.route.snapshot.paramMap.get('productId'));

    window.scrollTo(0, 0);
    this.errorMsg = '';
    this.searchFlag = false;

    /*
       In Edit mode, we will get product and image details
       */
    this.fileList.length = 0;

    //this.editProduct.productId = productId;

    // this.brandsService.getBrandsList().subscribe((data: Brands[]) => {
    //   this.brandsList = data;

    // });

    this.brandsList = this.cache.getList("brandsList");

    if (this.brandsList === undefined || this.brandsList === null) {
      this.brandsService.getBrandsList().subscribe((data: Brands[]) => {
        this.brandsList = data;
        this.brandsList.sort();
        this.cache.setList("brandsList", this.brandsList);

      });
    }
    this.warehouseList = this.cache.getList("warehouseList");

    if (this.warehouseList === undefined || this.warehouseList === null) {
      this.WarehouseService.getWareHouseList().subscribe((data: Warehouse[]) => {
        this.warehouseList = data;
        this.warehouseList.sort();
        this.cache.setList("warehouseList", this.warehouseList);

      });
    }

    //Get Category List
    this.categoryList = this.cache.getList("categoryList");

    if (this.categoryList === undefined || this.categoryList === null) {

      this.categoryService.getCategoryList().subscribe((data: Category[]) => {
        this.categoryList = data;

        this.categoryList.sort();
        this.cache.setList("categoryList", data);

      });
    }


    if (this.showImageFlag) {
      //Get the product
      //Get all Products
      this.productService.getProductsById(productId).subscribe((data: ProductView) => {
        let myData: ProductView = data;
        this.editProduct = myData;


        //Get all images for this product
        this.uploadService.getFilesFtp(this.editProduct.productId).subscribe(data => {
          //let productId = data.productId;
          let respArray: ResponseFile[] = data;
          if (data !== undefined) {
            for (let i = 0; i < respArray.length; i++) {
              let prodView: ProductImage = new ProductImage();
              prodView.fileType = respArray[i].type;
              prodView.finalImage = respArray[i].finalImage;
              prodView.fileName = respArray[i].name;
              prodView.productId = this.editProduct.productId;
              prodView.imageId = respArray[i].id;
              prodView.firstImage = respArray[i].firstImage;

              this.productImageViewList.push(prodView);
              //this.previewList.push(respArray[i])
            }//for loop

          }

          //Now get all the documents for this product
          //Code added on Oct 5, 2023, AHMEDMM
          this.uploadService.getDocuments(this.editProduct.productId).subscribe(data => {
            //let productId = data.productId;
            let docArray: ResponseFile[] = data;
            for (let i = 0; i < docArray.length; i++) {
              this.documentViewList.push(docArray[i]);
            }

            //alert(this.editProduct.productId);
            //this.showEdit();

            this.convertProductToForm(this.editProduct);

            //this.currentDepartment = this.editProduct.category;
            //window.scrollTo(0, 0);

          });

          this.WarehouseService.getWareHouseForProduct(this.editProduct.productId).subscribe(data => {
            //let productId = data.productId;
            let warehouseData = data;
            if (data != null) {
              this.convertWarehouseToForm(warehouseData);
            }


          });
          //Code ended on Oct 5, 2023, AHMEDMM


        });

        this.spinnerDataLoad = false;

      });
    }
    else {
      //Get the product

      let prodView: ProductImage = new ProductImage();
      prodView.fileType = '';
      prodView.finalImage = '';
      prodView.fileName = '';
      prodView.productId = this.editProduct.productId;
      prodView.imageId = 0;
      prodView.firstImage = '';

      this.productImageViewList.push(prodView);


      //Get all Products
      this.productService.getProductsByIdWithoutImage(productId).subscribe((data: ProductView) => {
        let myData: ProductView = data;
        this.editProduct = myData;




        this.spinnerDataLoad = false;

      });
    }






  }
  /* ******************************************************* */
  getFlagValue(flagVal: any): any {
    if (flagVal === undefined) {
      return false;
    }
    else if (flagVal === null) {
      return false;
    }
    else if (flagVal === 0) {
      return false;
    }
    else if (flagVal === 'N') {
      return false;
    }
    else if (flagVal === 1) {
      return true;
    }
    else if (flagVal === 'A') {
      return true;
    }
    else {
      return flagVal;
    }


  }

  /* ******************************************************************* */
  //This methods is used in Edit mode when data came from DB
  convertProductToForm(product: ProductView) {
    this.productForm.get('productId')?.setValue(product.productId);
    this.productForm.get('custId')?.setValue(product.custId);
    this.productForm.get('productName')?.setValue(product.productName);
    this.productForm.get('productDetails')?.setValue(product.productDetails);
    this.productForm.get('unitPrice')?.setValue(product.unitPrice);
    this.productForm.get('categoryId')?.setValue(product.categoryId);
    this.productForm.get('discount')?.setValue(product.discount);
    this.productForm.get('popularFlag')?.setValue(product.popularFlag);
    this.productForm.get('madein')?.setValue(product.madein);
    this.productForm.get('wholesalePrice')?.setValue(product.wholesalePrice);
    this.productForm.get('salePrice')?.setValue(product.salePrice);
    this.productForm.get('purchasePrice')?.setValue(product.purchasePrice);
    this.productForm.get('physicalDimension')?.setValue(product.physicalDimension);
    this.productForm.get('quantity')?.setValue(product.quantity);
    this.productForm.get('weight')?.setValue(product.weight);
    this.productForm.get('upc')?.setValue(product.upc);
    this.productForm.get('sku')?.setValue(product.sku);
    this.productForm.get('warehouseId')?.setValue(product.warehouseId);
    this.productForm.get('brandId')?.setValue(product.brandId);
    this.productForm.get('abbrName')?.setValue(product.abbrName);
    this.productForm.get('unitName')?.setValue(product.unitName);

    this.productForm.get('instockFlag')?.setValue(this.getFlagValue(product.instockFlag));
    this.productForm.get('sellinPcs')?.setValue(this.getFlagValue(product.sellinPcs));
    this.productForm.get('productStatus')?.setValue(this.getFlagValue(product.productStatus));
    this.productForm.get('popularFlag')?.setValue(this.getFlagValue(product.popularFlag));

    this.productForm.get('tax')?.setValue(this.getFlagValue(product.tax));

    //Added on Feb 25, 2024
    this.productForm.get('qtyCase')?.setValue(product.qtyCase);

    //this.productForm.get('expiryDate')?.setValue(product.expiryDate);
    let expiryDate: any = this.datepipe.transform(product.expiryDate, "yyyy-MM-dd");
    this.productForm.get('expiryDate')?.setValue(expiryDate);



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

  /* ************************************************************** */
  categoryProductChange() {
    let obj = this.productForm.get('categoryId');
    if (obj !== null || obj !== undefined) {
      let catId = obj?.value;
      let catName = this.getCategoryName(Number(catId));
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
  /* ********************************************************************** */
  backToList() {

    this.router.navigate(['products']);


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
    this.router.navigate(['/products']);
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
      this.productViewList[i].tax = productList[i].tax;

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
      this.productViewList[i].warehouseId = productList[i].warehouseId;
      this.productViewList[i].brandId = productList[i].brandId;
      this.productViewList[i].abbrName = productList[i].abbrName;
      this.productViewList[i].unitName = productList[i].unitName;


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
    product.tax = this.productForm.get('tax')?.value;

    //Added on Feb 25, 2024
    product.qtyCase = this.productForm.get('qtyCase')?.value;
    product.expiryDate = this.productForm.get('expiryDate')?.value;


    product.cuttingAttributes = this.getAttributes('cuttingAttributes');
    product.packagingAttributes = this.getAttributes('packagingAttributes');
    product.optionsAttributes = this.getAttributes('optionsAttributes');
    product.extraAttributes = this.getAttributes('extraAttributes');

    return product;
  }

  /* *********************************************************************** */
  convertFormToWarehouse(productId: any): WarehouseProducts {
    let warehouse = new WarehouseProducts();

    warehouse.warehouseId = this.warehouseForm.get('warehouseId')?.value || "";

    warehouse.productId = productId;
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
          if (warehouse.warehouseId !== '') {
            this.WarehouseService.saveWareHouseProduct(warehouse).subscribe(data => {
              let warehouseData = data.warehouse;
            });

          }



        }


        /********************************** WAREHOUSE END  ********************************************** */
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
          Swal.fire('File Too Big', 'Image is too big to upload. Please resize to max 1965KB');
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
          //window.location.reload();
          this.backToList();
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
  /* ********************************************************** */
  removeImage(productId: any, imageId: any) {

    //Remove current product Image
    this.productService.deleteImageFtp(productId, imageId).subscribe((data: any) => {
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
  /* *************************************************************** */

  /* *********************************************************************** */
  //This method is used to convert Form data to Product Object.
  convertFormToProductClone(): Product {
    let product = new Product();
    let myNull = null;

    product.productId = -1;
    product.custId = this.productForm.get('custId')?.value;
    product.productName = this.productForm.get('productName')?.value + '  (CLONED)';
    product.productDetails = this.productForm.get('productDetails')?.value;
    product.categoryId = this.productForm.get('categoryId')?.value;
    product.discount = this.productForm.get('discount')?.value;
    product.unitPrice = this.productForm.get('unitPrice')?.value;
    product.popularFlag = (this.productForm.get('popularFlag')?.value ? 1 : 0);

    let statusInput = <HTMLInputElement>(document.getElementById('productStatus'));
    product.productStatus = (this.productForm.get('productStatus')?.value ? 'A' : 'N');

    if (statusInput.checked) {
      product.productStatus = 'A';
    }
    else {
      product.productStatus = 'N';
    }

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

    product.qtyCase = this.productForm.get('qtyCase')?.value;
    product.expiryDate = this.productForm.get('expiryDate')?.value;

    product.cuttingAttributes = this.getAttributes('cuttingAttributes');
    product.packagingAttributes = this.getAttributes('packagingAttributes');
    product.optionsAttributes = this.getAttributes('optionsAttributes');
    product.extraAttributes = this.getAttributes('extraAttributes');

    return product;
  }//convertFormToProductClone()

  /* *********************************************************************** */
  convertFormToWarehouseProductClone(): WarehouseProducts {
    let warehouse = new WarehouseProducts();
    let myNull = null;

    warehouse.productId = -1;
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

  }//convertFormToProductClone()
  /* *********************************************************************** */
  onCloneSubmit() {

    //Return if Form is not valid
    if (!this.productForm.valid) {
      //Swal.fire('Submit', ' ' + productId + ' Succesfully!', 'success')
      return;
    }
    let product: Product = this.convertFormToProductClone();

    let cloneFile: File;

    this.productService.saveProduct(product)
      .subscribe(data => {
        let productId = data.productId;
        if (productId !== null || productId !== undefined) {
          this.alertWithSuccess(productId);
          this.backToList();
        }


        if (!this.warehouseForm.valid) { //Swal.fire('Submit', ' ' + productId + ' Succesfully!', 'success')
          return;
        }
        let warehouse: WarehouseProducts = this.convertFormToWarehouseProductClone();
        this.WarehouseService.saveWareHouseProduct(warehouse).subscribe(data => {
          let warehouseData = data.warehouse;
          //   if (data !== undefined){
          //     let warehouse = data.warehouse;
          //  }
        });

        //if (this.currentFile===undefined){
        //get it from loaded image from DB

        //this.currentFile.name=this.editProduct.imageFilename;
        //this.currentFile.type=this.editProduct.imageMimeType;
        //this.currentFile.arrayBuffer = this.editProduct.productImage;

        //cloneFile.name = this.editProduct.imageFilename;
        //cloneFile.type =this.editProduct.imageMimeType;
        //cloneFile.arrayBuffer = this.editProduct.productImage;

        //this.currentFile = cloneFile;
        //}
        //No Image Saved for clone product. User will add a new image to it later. No sense to have same pic for cloned item

        // //Now save Image
        /*        this.uploadService.upload(this.currentFile, productId).subscribe({
                  next: (event: any) => {
                    this.alertWithSuccess(productId);
                    this.resetImageProgressSection();
                    this.onReset();
                    this.refreshList();


                  },
                  error: (err: any) => {
                    console.log(err);
                    this.progress = 0;

                    if (err.error && err.error.message) {
                      this.message = err.error.message;
                    } else {
                      this.message = 'Could not upload the image!';
                    }

                    this.currentFile = undefined;
                  },

                });*/

      });

  }//onCloneSubmit()

  onCheckboxChange(event: any) {
    this.inputValue = event.target.checked ? 'CUTPRICE' : '';
  }

  onCheckboxChange1(event: any) {
    this.inputValue1 = event.target.checked ? 'HOTTREND' : '';
  }

  /* ******************************************************************* */
  //This methods is used in Edit mode when data came from DB
  convertWarehouseToForm(warehouseProduct: WarehouseProducts) {
    this.warehouseForm.get('productId')?.setValue(warehouseProduct.productId);
    this.warehouseForm.get('warehouseId')?.setValue(warehouseProduct.warehouseId);
    this.warehouseForm.get('wFloor')?.setValue(warehouseProduct.wFloor);
    this.warehouseForm.get('wAisle')?.setValue(warehouseProduct.wAisle);

    this.warehouseForm.get('wRow')?.setValue(warehouseProduct.wRow);
    this.warehouseForm.get('wBin')?.setValue(warehouseProduct.wBin);
    this.warehouseForm.get('fromWarehouseId')?.setValue(warehouseProduct.fromWarehouseId);

    this.warehouseForm.get('quantity')?.setValue(warehouseProduct.quantity);
    this.warehouseForm.get('intransitFlag')?.setValue(warehouseProduct.intransitFlag);
    this.warehouseForm.get('shipmentMode')?.setValue(warehouseProduct.shipmentMode);


  }


  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 1) {
      Swal.fire('Error: You can only select one video file');
      return;
    }
    const file: File = files[0];
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