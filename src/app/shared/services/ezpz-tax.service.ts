import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { EzpzTax } from '../../shared/models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class EzpzTaxService {

  constructor(private http: HttpMethodService) { }

  getAll(): Observable<EzpzTax[]> {
    return this.http.get<EzpzTax[]>('ezpzTax/findAll');
  }

  save(data: EzpzTax): Observable<EzpzTax> {
    return this.http.post<EzpzTax>('ezpzTax/save', data);
  }

  delete(id: number): Observable<any> {
    return this.http.post<any>(`ezpzTax/delete/${id}`, {});
  }
}