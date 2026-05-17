import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Warehouse } from '../../shared/models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class WarehousService {
  private myUrl = environment.apiUrl ; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http:HttpClient) { }

  saveWareHouse(warehouse: Warehouse): Observable<Warehouse>{

    let myUrl = `${this.myUrl}` + `warehouse/save`  ;

    return this.http.post<Warehouse>(myUrl, warehouse).pipe(
        // tap( Errors ==> this.log('Save Stocks') ),
      catchError(this.errors.handleError<Warehouse>('saveWarehouse'))
  );

  }

  /* **************************************************************** */
delete(warehouseId: number): Observable<any>{
  let myUrl = `${this.myUrl}` + `warehouse/delete/` + warehouseId;
  return this.http.post<any>(myUrl, warehouseId).pipe(
      //tap( error ==> this.log('delete DepartmentList') ),
    catchError(this.errors.handleError<any>('deleteDepartment'))
  );
}
/* **************************************************************** */

getWareHouseList(): Observable<Warehouse[]>{

  let myUrl = `${this.myUrl}` + `warehouse/findAll` ;

  return this.http.get<Warehouse[]>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Warehouse') ),
    catchError(this.errors.handleError<Warehouse[]>('getWareHouseList'))
);
}


/* **************************************************************** */

}
