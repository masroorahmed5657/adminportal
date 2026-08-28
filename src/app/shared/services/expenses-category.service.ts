import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { ExpenseCategory } from '../../shared/models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesCategoryService {

  constructor(private http: HttpMethodService) { }

  getAll(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>('expenseCategory/findAll');
  }

  save(data: ExpenseCategory): Observable<ExpenseCategory> {
    return this.http.post<ExpenseCategory>('expenseCategory/save', data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`expenseCategory/delete/${id}`);
  }
}