import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { Invoice, InvoiceOnly, InvoiceOnlyItems, InvoiceOnlySaveResponse } from '../models/model-classes.model';
import { Observable, catchError } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private myUrl = environment.apiUrl ; //http://localhost:8080/FASHION_API/
  errors: Errors = new Errors();

  constructor(private http:HttpMethodService) { }


    /* ************************************************************* */

    invoiceFindAll(): Observable<Invoice[]>{

      // let myUrl = `${this.myUrl}` + `invoice/findAll/` ;

      return this.http.get<Invoice[]>('invoice/findAll/')

    }
  /* ************************************************************* */

  invoiceSave(): Observable<Invoice[]>{

    // let myUrl = `${this.myUrl}` + `invoice/save/` ;

    return this.http.get<Invoice[]>(`invoice/save/`)

  }
/* ************************************************************* */
invoiceOnlySave(invoiceOnlySaveResponse:InvoiceOnlySaveResponse): Observable<InvoiceOnlySaveResponse >{

  // let myUrl = `${this.myUrl}` + `invoiceonly/save/` ;

  return this.http.post<InvoiceOnlySaveResponse >(`invoiceonly/save/`, invoiceOnlySaveResponse)

}


}