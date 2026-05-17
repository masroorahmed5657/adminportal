import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductView, Product } from '../../shared/models/model-classes.model';
import { ProductsService } from '../../shared/services/products.service';
import Swal from "sweetalert2";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-adjustment',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-adjustment.component.html',
  styleUrl: './inventory-adjustment.component.scss'
})
export class InventoryAdjustmentComponent implements OnInit {


  product: ProductView = new ProductView();
  productList: Product[] = [];
  adjQty: any;
  upc: any;
  sku: any;
  searchText = '';
  search: string = '';

  constructor(
    private productService: ProductsService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    let p = this.product;
    let t1 = p.imageMimeType;
  }


  onSubmit() {

    if (this.adjQty === undefined) {
      Swal.fire('Submit', 'Please enter Qty to Adjust', 'warning');
      return;
    }

    let newQtyAdj = (this.adjQty === null) ? 0 : this.adjQty;

    let productAdj = new Product();

    productAdj.productId = this.product.productId;
    productAdj.quantity = newQtyAdj; //    this.product.quantity;


    this.productService.inventoryAdjust(productAdj).subscribe(data => {
      let productId = data.productId;
      if (productId !== null || productId != undefined) {
        Swal.fire('Submit', 'You have adjusted the Inventory' + productId + ' Succesfully!', 'success');
        window.location.reload();
      }
    });

  }

  onSubmitWeight() {
    if (this.adjQty === undefined) {
      Swal.fire('Submit', 'Please enter Qty to Adjust', 'warning');
      return;
    }
    this.product.weight = (this.adjQty === null) ? 0 : this.adjQty;

    let productAdj = new Product();

    productAdj.productId = this.product.productId;
    productAdj.weight = this.product.weight;


    this.productService.inventoryAdjustWeight(productAdj).subscribe(data => {
      let productId = data.productId;
      if (productId !== null || productId != undefined) {
        Swal.fire('Submit', 'You have adjusted the Inventory' + productId + ' Succesfully!', 'success')
      }
    });

  }


  upcSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let upc = this.upc;
      this.productService.getProductsByUPC(this.upc).subscribe((data: ProductView) => {

        this.product = data;
      });

    }
    else {
      myScan = event.target.value;
    }


  }
  /* *************************************************** */

  skuSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let sku = this.sku;
      this.productService.getProductsBySKU(this.sku).subscribe((data: ProductView[]) => {
        this.product = data[0];
        let i = 0;

      });

    }
    else {
      myScan = event.target.value;
    }

  }
  /* *************************************************** */

  clear() {
    this.upc = '';
    this.sku = '';
    this.product = new ProductView();
  }
  /* *************************************************** */
  signOut() {
    //this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    //  this.cache.resetAllData();

    this.router.navigate(['login']);
  }

  onNameSearch(event: any) {
    const value = event.target.value.trim();

    if (value.length < 4) {
      this.productList = [];
      return;
    }

    this.productService.getSearchProducts(value)
      .subscribe((res: any[]) => {
        this.productList = res;
      });
  }


  nameSearchKey() {

    let productView: ProductView[] = [];
    //this.onSearch();
    let nameSearch = <HTMLInputElement>document.getElementById('name-search');
    this.search = nameSearch.value;

    if (this.search === null || this.search === undefined || this.search === '') {
      //Don't do anything
    }
    else {
      this.productService.getSearchProducts(this.search).subscribe((data) => {
        //let productId = data.productId;
        this.productList
        productView = data;



        if (productView === null) {
          Swal.fire(
            'Not Found',
            'Product Does not exist for this UPC',
            'error'
          );

        }
        else if (productView !== null || productView !== undefined) {


          //alert('Product List: ' + productView.length);

        }

      });

    }

  }
  /* *************************************************** */
  selectProduct(product: any) {
    //this.selectedProduct = product;
    this.searchText = product.name;   // show selected name in input
    this.productList = [];            // hide dropdown

    this.product = product;
    //this.commonAdditionToCart(product);


  }


  /* *************************************************** */
}
