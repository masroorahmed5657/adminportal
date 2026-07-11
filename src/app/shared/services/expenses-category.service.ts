import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethodService } from '../helper/http-method.service';
import { Categories } from '../../shared/models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesCategoryService {

  constructor(private http: HttpMethodService) { }

  getAll(): Observable<Categories[]> {
    return this.http.get<Categories[]>('categories/findAll').pipe(
      map(cats => cats.filter(c => c.type === 'EXPENSE'))
    );
  }

  save(data: Categories): Observable<Categories> {
    data.type = 'EXPENSE';   // force type
    return this.http.post<Categories>('categories/save', data);
  }

  delete(id: number): Observable<any> {
    return this.http.post<any>(`categories/delete/${id}`, {});
  }
}