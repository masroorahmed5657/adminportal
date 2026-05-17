import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse, BarcodeResponse, CartHold, Category, Product, ProductView, ProductWrapper, URLRequest } from '../models/model-classes.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors'
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private myUrl = environment.apiUrl; //http://localhost:8082/FASHION_API/category

  errors: Errors = new Errors();

  constructor(private http: HttpMethodService) { }
  //appLogService: AppLoggerService = new AppLoggerService() ;


  /* ************************************************************* */
  saveProduct(product: Product): Observable<Product> {

    // let myUrl = `${this.myUrl}` + `products/save/`;

    return this.http.post<Product>('products/save', product);

  }
  /* ************************************************************* */
  saveEditProduct(product: Product): Observable<any> {

    // let myUrl = `${this.myUrl}` + `products/saveEdit/`;

    return this.http.post<any>('products/saveEdit', product)

  }

  /* ************************************************************* */
  getProducts(categoryId: number): Observable<ProductWrapper> {

    // let myUrl = `${this.myUrl}` + `products/findProductsByCategory/` + categoryId;

    return this.http.get<ProductWrapper>('products/findProductsByCategory/' + categoryId)

  }
  /* ************************************************************* */
  getLowInventoryProducts(categoryId: number, quantity: number): Observable<ProductWrapper> {

    // let myUrl = `${this.myUrl}` + `products/findLowInventoryProductsByCategory/` + categoryId + '/' + quantity;

    return this.http.get<ProductWrapper>(`products/findLowInventoryProductsByCategory/` + categoryId + '/' + quantity)
  }
  /* ************************************************************* */
  getProductsById(productId: number): Observable<ProductView> {

    // let myUrl = `${this.myUrl}` + `products/getProductOnly/` + productId;

    return this.http.get<ProductView>(`products/getProductOnly/` + productId)

  }
  /* ************************************************************* */
  getProductsByIdWithoutImage(productId: number): Observable<ProductView> {

    // let myUrl = `${this.myUrl}` + `products/withoutImage/` + productId;

    return this.http.get<ProductView>(`products/withoutImage/` + productId)

  }
  /* ************************************************************* */
  getProductsByUPC(upc: string): Observable<ProductView> {

    // let myUrl = `${this.myUrl}` + `products/pos/findProductsByUpc/` + upc;

    return this.http.get<ProductView>(`products/pos/findProductsByUpc/` + upc)

  }
  /* ************************************************************* */
  getProductsBySKU(sku: string): Observable<ProductView[]> {

    // let myUrl = `${this.myUrl}` + `products/pos/findProductsBySku/` + sku;

    return this.http.get<ProductView[]>(`products/pos/findProductsBySku/` + sku)

  }

  /* ************************************************************* */

  getProductsByPrice(price: any, pageSize: any, pageNo: any): Observable<ProductWrapper> {

    // let myUrl = `${this.myUrl}` + `products/withoutImage/searchProductsByPrice/` + price + '/' + pageSize + '/' + pageNo;

    return this.http.get<ProductWrapper>(`products/withoutImage/searchProductsByPrice/` + price + '/' + pageSize + '/' + pageNo)
  }

  /* ************************************************************* */
  delete(productId: number): Observable<any> {

    // let myUrl = `${this.myUrl}` + `products/delete/` + productId;

    return this.http.delete(`products/delete/` + productId)
  }


  /* ************************************************************* */
  deleteImage(productId: number, imageId: number): Observable<any> {

    // let myUrl = `${this.myUrl}` + `productImage/delete/` + productId;

    return this.http.delete(`productImage/delete/` + productId)

  }
  /* ************************************************************* */
   deleteImageFtp(productId: number, imageId: number): Observable<any> {

    // let myUrl = `${this.myUrl}` + `productImage/deleteImageFtp/` + productId + '/' + imageId;

    return this.http.delete(`productImage/deleteImageFtp/` + productId + '/' + imageId)

  }
  /* ************************************************************* */
  deleteDoc(productId: number, docId: number): Observable<any> {

    // let myUrl = `${this.myUrl}` + `productDocuments/delete/` + productId + `/` + docId;

    return this.http.delete(`productDocuments/delete/` + productId + `/` + docId)

  }

  /* ************************************************************* */
  inventoryAdjust(product: Product): Observable<Product> {

    // let myUrl = `${this.myUrl}` + `inventoryAdjust/`  ;

    return this.http.post<Product>(`inventoryAdjust`, product)

  }
  /* ************************************************************* */
  inventoryAdjustWeight(product: Product): Observable<Product> {

    // let myUrl = `${this.myUrl}` + `inventoryWeightAdjust/`;

    return this.http.post<Product>(`inventoryWeightAdjust/`, product)

  }
  /* ************************************************************* */
  discountProduct(product: Product): Observable<Product> {

    // let myUrl = `${this.myUrl}` + `products/discount/`;

    return this.http.post<Product>(`products/discount/`, product)

  }
  /* ************************************************************* */
  getExpiryProducts(expiryDays: any): Observable<ProductWrapper> {

    // let myUrl = `${this.myUrl}` + `products/getExpiryProducts/` + expiryDays;

    return this.http.get<ProductWrapper>(`products/getExpiryProducts/` + expiryDays)

  }
  /* ************************************************************* */

  importProductsByCategory(categoryId: number): Observable<ApiResponse> {

    // let myUrl = `${this.myUrl}` + `files/importProducts/` + categoryId;

    return this.http.get<ApiResponse>(`files/importProducts/` + categoryId)

  }
  /* ************************************************************* */
  getProductsByItem(item: string): Observable<ProductWrapper> {

    // let myUrl = `${this.myUrl}` + `products/searchProducts/` + item;

    return this.http.get<ProductWrapper>(`products/searchProducts/` + item)

  }

  /* ************************************************************* */
  importProductsFromFileAtDrive(): Observable<ApiResponse> {

    // let myUrl = `${this.myUrl}` + `files/importProducts`;

    return this.http.get<ApiResponse>(`files/importProducts`)

  }

  localAddToCarts(data: Product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
    }
    else {
      cartData = JSON.parse(localCart);
      cartData.push(data)
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }

    //this.cartData.emit(cartData)

  }
  /* ******************************************************** */
  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: Product[] = JSON.parse(cartData);
      items = items.filter((item: Product) => productId !== item.productId);
      localStorage.setItem('localCart', JSON.stringify(items));
      //this.cartData.emit(items);
    }
  }
  /* ******************************************************** */


  generateBarCode(): Observable<ApiResponse> {

    // let myUrl = `${this.myUrl}` + `products/generateBarCode`;

    return this.http.get<ApiResponse>(`products/generateBarCode`)

  }
/* ************************************************************* */
  getProductsByCategory(categoryId: any): Observable<ProductWrapper>{

    //let myUrl = `${this.myUrl}` + `products/findProductsByCategory/${categoryId}`  ;

    return this.http.get<ProductWrapper>(`products/findProductsByCategory/${categoryId}`).pipe(
        //tap( error ==> this.log('Fetched Product') ),
      catchError(this.errors.handleError<ProductWrapper>('getProductsByCategory'))
    );
  }


  /* ************************************************************* */
  getSearchProducts(search: any): Observable<ProductView[]> {

    // let myUrl = `${this.myUrl}` + `products/pos/searchProducts/` + search;

    return this.http.get<ProductView[]>(`products/pos/searchProducts/` + search)
  }

  /* ************************************************************* */
  getFirstLatestProducts(pageSize: any, pageNo: any): Observable<ProductView[]> {

    // let myUrl = `${this.myUrl}` + `products/withoutimage/findFirstLatestProducts/` + pageSize + '/' + pageNo;

    return this.http.get<ProductView[]>(`products/findFirstLatestProducts/` + pageSize + '/' + pageNo)
  }
/* *********************************************************************** */
//findTotalProductsCount
  findTotalProductsCount(){
    return this.http.get<ProductView[]>(`products/findTotalProductsCount` );
  }
  

  /* ******************************************************** */
  localAddToCart(data: CartHold) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    localStorage.setItem('localCart', JSON.stringify(data));

  }
  /* ******************************************************** */

  importProducts(file: File): Observable<ApiResponse> {
  
      return this.http.upload<any>('files/importProductsAll', file);
  }


}//ProductsService()
