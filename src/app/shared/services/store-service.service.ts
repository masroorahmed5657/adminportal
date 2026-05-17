import { Injectable } from '@angular/core';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { StoreHours } from '../models/model-classes.model';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class StoreServiceService {

  private myUrl = environment.apiUrl ; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http:HttpMethodService) { }


saveStoreHour(storeHour: StoreHours): Observable<StoreHours>{

  let myUrl = `${this.myUrl}` + `storeHours/save`  ;

  return this.http.post<StoreHours>("storeHours/save", storeHour)

}
/* ********************* */
getStoreHoursList(): Observable<StoreHours[]>{

  let myUrl = `${this.myUrl}` + `storeHours/findAllStoreHours` ;

  return this.http.get<StoreHours[]>("storeHours/findAllStoreHours")
}

/* ********************* */
}
