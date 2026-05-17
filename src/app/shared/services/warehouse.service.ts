import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Warehouse, WarehouseProducts } from '../models/model-classes.model';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private myUrl = environment.apiUrl; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http: HttpMethodService) { }

  saveWareHouse(warehouse: Warehouse): Observable<Warehouse> {

    // let myUrl = `${this.myUrl}` + `warehouse/save`  ;

    return this.http.post<Warehouse>('warehouse/save', warehouse)
  }

  /* **************************************************************** */
  delete(warehouseId: number): Observable<any> {
    // let myUrl = `${this.myUrl}` + `warehouse/delete/` + warehouseId;
    return this.http.post<any>('warehouse/delete/', warehouseId)
  }
  /* **************************************************************** */

  getWareHouseList(): Observable<Warehouse[]> {

    // let myUrl = `${this.myUrl}` + `warehouse/findAll`;

    return this.http.get<Warehouse[]>('warehouse/findAll')
  }




  saveWareHouseProduct(warehouseProduct: WarehouseProducts): Observable<any> {

    // let myUrl = `${this.myUrl}` + `warehouseproducts/save`;

    return this.http.post<Warehouse>('warehouseproducts/save', warehouseProduct)

  }
  /* **************************************************************** */
  getWareHouseForProduct(productId: any): Observable<WarehouseProducts> {

    // let myUrl = `${this.myUrl}` + `warehouseproducts/findByProductId/` + productId;

    return this.http.get<WarehouseProducts>('warehouseproducts/findByProductId/' + productId)
  }





}
