import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brands, Category, ApiResponse } from '../../shared/models/model-classes.model';
import { BrandsService } from '../../shared/services/brands.service';
import { CacheService } from '../../shared/services/cache.service';
import { CategoryService } from '../../shared/services/category.service';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { ProductsService } from '../../shared/services/products.service';
import { faPlusSquare, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from "../../layouts/header/header.component";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@Component({
  selector: 'app-import-products',
  imports: [HeaderComponent, FooterComponent,FontAwesomeModule],
  templateUrl: './import-products.component.html',
  styleUrl: './import-products.component.scss'
})

export class ImportProductsComponent implements OnInit {

  spinnerDataLoad = false;
  faPlusSquare = faPlusSquare;
  brandsList: Brands[] = [];
  categoryList: Category[] = [];

  selectedCategory: any;
  currentDepartment = '';



  /* ************************ METHODS SECTION ************************* */
  constructor(private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductsService,
    private uploadService: FileUploadService,
    private brandsService: BrandsService,
    private categoryService: CategoryService
  ) { }


  /* ******************************************************************* */
  ngOnInit(): void {

    window.scrollTo(0, 0);

    this.spinnerDataLoad = true;

    this.brandsService.getBrandsList().subscribe((data: Brands[]) => {
      this.brandsList = data;

    });

    //Get Category List
    this.categoryService.getCategoryList().subscribe((data: Category[]) => {
      this.categoryList = data;

      this.categoryList.sort();

    });

    //Default Category and department. First check if any
    let cat = this.cache.get('selectedCategory');
    let dept = this.cache.get('currentDepartment');

    if (cat != null || cat != undefined) {
      this.selectedCategory = cat;
    }
    else {
      this.selectedCategory = 1;

    }

    if (dept != null || dept != undefined) {
      this.currentDepartment = dept;
    }

  }

  /* ************************************** */
  importProductByCategory() {
    //alert('Import Product');
    this.productService.importProductsByCategory(this.selectedCategory).subscribe((data: ApiResponse) => {
      let myData = data;

      this.spinnerDataLoad = false;
    });


  }
  /* ************************************** */
  importProduct() {
    //alert('Import Product');
    this.productService.importProductsFromFileAtDrive().subscribe((data: ApiResponse) => {
      let myData = data;

      this.spinnerDataLoad = false;
    });


  }

}
