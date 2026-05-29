import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { CashierShift } from '../models/model-classes.model';


@Injectable({
  providedIn: 'root'
})
export class CashierShiftService {

      private myUrl = environment.apiUrl
  
    constructor(private http: HttpMethodService) {
  
      // super('category');
      // http.setEndpoint('category');
    }
  
    getList(): Observable<CashierShift[]> {
  
      return this.http.get<CashierShift[]>(`cashierShift/findAll`)
  
    }
  
    delete(logId: any): Observable<any> {
  
      return this.http.post(`cashierShift/delete/${logId}`, {}); 
    }
  
    save(cashierShift: CashierShift){
      return this.http.post<CashierShift>('cashierShift/save', cashierShift);
    }
}
