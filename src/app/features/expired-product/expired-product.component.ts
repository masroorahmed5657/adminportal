import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, ProductView, ProductWrapper } from '../../shared/models/model-classes.model';
import { CacheService } from '../../shared/services/cache.service';
import { CategoryService } from '../../shared/services/category.service';
import { ProductsService } from '../../shared/services/products.service';
import { faPlusSquare, faRemove, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-expired-product',
  imports: [CommonModule],
  templateUrl: './expired-product.component.html',
  styleUrl: './expired-product.component.scss',
  providers: [DatePipe]
})

export class ExpiredProductComponent implements OnInit {
  faPlusSquare = faPlusSquare;
  currentPageNumber: number = 1;
  faDollar = faDollar;
  faRemove = faRemove;

  groceryFlag = false;
  expiryDays = 20;
  numberOfDays: any;

  categoryList: Category[] = [];
  productViewList: ProductView[] = [];
  productImageViewList: ProductView[] = [];
  selectedCategory: any;
  currentDepartment = '';
  submitted = false;
  spinnerDataLoad = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductsService,
    private categoryService: CategoryService,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {

    window.scrollTo(0, 0);
    this.productImageViewList.length = 0;
    this.spinnerDataLoad = true;



    //Get all Products
    this.productService.getExpiryProducts(this.expiryDays).subscribe((data: ProductWrapper) => {
      let myData = data;
      this.productViewList = myData.productList; //this.productDecorator(myData.productList);
      this.spinnerDataLoad = false;
    });

  }

  formatDate(timestamp: any) {
    let retDate = this.datePipe.transform(timestamp, 'yyyy-MM-dd');
    
    return retDate;
  }

  /* *********************************************************************** */
  productDecorator(productList: ProductView[]): any {
    let myCategory: Category;
    for (let i = 0; i < productList.length; i++) {
      this.productViewList[i] = new ProductView();

      // this.productViewList[i].categoryId = productList[i].categoryId;
      // this.productViewList[i].productId = productList[i].productId;
      this.productViewList[i].productName = productList[i].productName;
      this.productViewList[i].unitPrice = productList[i].unitPrice;
      // this.productViewList[i].productDetails = productList[i].productDetails;
      // this.productViewList[i].custId = productList[i].custId;
      // this.productViewList[i].discount = productList[i].discount;
      // this.productViewList[i].popularFlag = productList[i].popularFlag;
      // this.productViewList[i].productStatus = productList[i].productStatus;
      // this.productViewList[i].packagingAttributes = productList[i].packagingAttributes;
      // this.productViewList[i].cuttingAttributes = productList[i].cuttingAttributes;
      // this.productViewList[i].extraAttributes = productList[i].extraAttributes;
      // this.productViewList[i].optionsAttributes = productList[i].optionsAttributes;
      // this.productViewList[i].purchasePrice = productList[i].purchasePrice;
      // this.productViewList[i].quantity = productList[i].quantity;
      // this.productViewList[i].physicalDimension = productList[i].physicalDimension;
      // this.productViewList[i].wholesalePrice = productList[i].wholesalePrice;
      // this.productViewList[i].salePrice = productList[i].salePrice;
      // this.productViewList[i].weight = productList[i].weight;
      // this.productViewList[i].madein = productList[i].madein;
      // this.productViewList[i].sku = productList[i].sku;
      // this.productViewList[i].upc = productList[i].upc;
      // this.productViewList[i].brandId = productList[i].brandId;
      // this.productViewList[i].abbrName = productList[i].abbrName;

      /************************************** */
      // this.productViewList[i].popularFlag = productList[i].popularFlag;
      // this.productViewList[i].sellinPcs = productList[i].sellinPcs;
      // this.productViewList[i].instockFlag = productList[i].instockFlag;
      //Just for safe side
      this.productViewList[i].productImage = productList[i].productImage;
      this.productViewList[i].imageMimeType = productList[i].imageMimeType;

      // this.productViewList[i].expiryDate = this.datepipe.transform(productList[i].expiryDate, "MM/dd/yyyy");
      this.numberOfDays = 12;


    }
    return this.productViewList;
  }

  /* ******************************************* END OF COMPONENT ****************************** */
}//end of component
