import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  ProductWrapper, Product, BarcodeResponse, CartHold, ApiResponse} from '../models/model-classes.model';
import { environment } from '../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { AlertMessage, Category, ProductView } from '../models/model-classes.model';
import { Errors } from '../errors/errors';
import { HttpMethodService } from '../helper/http-method.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private myUrl = environment.apiUrl  ; //http://localhost:9080/PAG_WS/

  //cartData= new EventEmitter<Product[] | []>();


  constructor(private http:HttpClient, private http2: HttpMethodService) { }

  errors: Errors = new Errors();

  addProduct(data:Product){

    //let myUrl = `${this.myUrl}` + `Products/${id}`  ;

    return this.http.post('http:localhost:3000/Product', data)
  }
/* ******************************************************** */
  getProduct(id: any) {
    let myUrl = `${this.myUrl}` + `products/${id}`  ;

    return this.http.get<Product>(myUrl);

  }
/* ************************************************************* */
clearCart() {
  //local cart sy data get kary gy
   let localCart = localStorage.getItem('localCart');
   //check kary gy data hai
   if (localCart) {
   //srings data ku convert kary gy objects mai
   let cartData = JSON.parse(localCart);
  //object ky ander products ku blank kardygy
    cartData.product = [];
    //localcart ku phir sy update karydy gy
     localStorage.setItem('localCart', JSON.stringify(cartData));
   } else {
   //if data nai hai toh builten blank set karydy
     //localStorage.setItem('localCart', JSON.stringify(''));
   }
 }

/************************************** */

/* ******************************************************** */
addToHoldCart(data:CartHold){
  let cartData = [];
  let localCart = localStorage.getItem('localCart');
  //if there is no data in cart
  //if (!localCart){
    localStorage.setItem('localCart',JSON.stringify(data));
  // }
  //// else{
    //else if there is a data in cart
 //   // cartData=JSON.parse(localCart);
 //   // cartData.push(data)
 //   // localStorage.setItem('localCart', JSON.stringify(cartData));
////
//  // }
////
//  //this.cartData.emit(cartData)

  }



/* ******************************************************** */
  localAddToCart(data:Product){
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart){
      localStorage.setItem('localCart',JSON.stringify([data]));
    }
    else{
      cartData=JSON.parse(localCart);
      cartData.push(data)
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }

    //this.cartData.emit(cartData)

    }
/* ******************************************************** */
    removeItemFromCart(ProductId: number) {
      let cartData = localStorage.getItem('localCart');
      if (cartData) {
        let items: Product[] = JSON.parse(cartData);
        items = items.filter((item: Product) => ProductId !== item.productId);
        localStorage.setItem('localCart', JSON.stringify(items));
        //this.cartData.emit(items);
      }
    }
/* ******************************************************** */
    getCategoryList(): Observable<Category[]>{

      let myUrl = `${this.myUrl}` + `category/findAll`  ;

      return this.http.get<Category[]>(myUrl).pipe(
          //tap( error ==> this.log('Fetched orders') ),
        catchError(this.errors.handleError<Category[]>('getCategoryList'))
      );

    }
/* ******************************************************** */
  getCategoryByNameList(catName:any): Observable<Category[]>{

    let myUrl = `${this.myUrl}` + `category/findAllByCategoryName/` +  catName ;

    return this.http.get<Category[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched orders') ),
      catchError(this.errors.handleError<Category[]>('getCategoryByNameList'))
    );

  }
/* ************************************************************* */
getProducts(categoryId: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/findProductsByCategory/` + categoryId ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getProducts'))
  );
}
/* ************************************************************* */
getProductsByCategory(categoryId: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/findProductsByCategory/` + categoryId ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getProducts'))
  );
}
/* ************************************************************* */
popularProducts(): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/findPopularProducts`  ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('popularProducts'))
  );
}
/* ************************************************************* */
popularMeatProducts(): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/findPopularMeatProducts`  ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('popularMeatProducts'))
  );
}
/* ************************************************************* */
foodProducts(categoryId: number): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/findFoodProducts/` + categoryId  ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('foodProducts'))
  );
}
/* ************************************************************* */
getSearchProducts(search: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/searchProducts/` + search ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getSearchProducts'))
  );
}

/* ************************************************************* */
sendSms(alert: AlertMessage): Observable<any>{
let myUrl = `${this.myUrl}` + `alert/sms` ;

    return this.http.post<any>(myUrl, alert).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<any>('sendSms'))
  );

}

/* ******************************************************** */
getRelatedProducts(categoryId: any, subCategory: any, countSize:any): Observable<ProductWrapper> {
  let myUrl = `${this.myUrl}` + `Products/relatedProducts/${categoryId}/${subCategory}/${countSize}`  ;
  return this.http.get<ProductWrapper>(myUrl);
}


getProductsBrands(brandId: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `Products/findProductsByBrands/` + brandId ;
  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getProducts'))
  );
}

/* ************************************************************* */
// getBarCode(barCode: string): Observable<BarcodeResponse>{

//   let myUrl = `${this.myUrl}` + `barcodes/qr/` + barCode ;

//   return this.http.get<BarcodeResponse>(myUrl).pipe(
//       //tap( error ==> this.log('Fetched Product') ),
//     catchError(this.errors.handleError<BarcodeResponse>('getProducts'))
//   );

// }
getProductsByUPC(upc: string): Observable<ProductView>{

  let myUrl = `${this.myUrl}` + `products/findProductsByUpc/` + upc ;

  return this.http.get<ProductView>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductView>('getProducts'))
  );

}


getProductsBySKU(sku: string): Observable<ProductView>{

  let myUrl = `${this.myUrl}` + `products/findProductsBySku/` + sku ;

  return this.http.get<ProductView>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductView>('getProducts'))
  );

}




}
