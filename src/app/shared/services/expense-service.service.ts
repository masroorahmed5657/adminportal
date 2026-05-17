import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Categories, Expenses, ExpensesView, FinanceCategory } from '../models/model-classes.model';
import { HttpMethodService } from '../helper/http-method.service';
import { BaseHttpService } from '../helper/base.http.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private myUrl = environment.apiUrl ;

  constructor(private http: HttpMethodService, private httpClient: HttpClient) {
    
  }


/* *********** Expenses ****************************************** */
  getCategoryList(): Observable<FinanceCategory[]> {

    return this.http.get<FinanceCategory[]>('category/findAllFinanceCategories');

  }
  /* ********************* */

  getExpenseList(): Observable<ExpensesView[]> {

    return this.http.get<ExpensesView[]>('expenses/findAll');

  }
  /* ********************* */

  getExpenseByDateList(year:any, month:any): Observable<ExpensesView[]> {

    return this.http.get<ExpensesView[]>('expenses/findByDate/' + year + '/'+ month);

  }

  /* ********************* */
  getExpenseById(id:any): Observable<Expenses[]> {

    return this.http.get<Expenses[]>(`expenses/` + id);

  }

  saveExpenses(expenses: Expenses): Observable<Expenses> {

    return this.http.post<Expenses>('expenses/save', expenses)

  }
  /* ********************* */
  deleteExpenses(id: number): Observable<any> {

    return this.http.post<any>(`expenses/delete/${id}`, {})
  }




  // /* *************************************************** */

  // saveExpense(expense: Expenses): Observable<Expenses> {

  //   return this.http.post<Expenses>('expenses/save', expense)

  // }

  // /* *************************************************** */
  // getExpenseList(): Observable<Expenses[]> {

  //   return this.http.get<Expenses[]>('expenses/findAllExpenses')
  // }

  // /* **************************************************************** */
  // delete(expenseId: number): Observable<any> {

  //   return this.http.post<any>(`expenses/delete/${expenseId}`, {})

  // }
  // /* **************************************************************** */

  // getExpenseBySearch(expense: ExpensesRequest): Observable<ExpensesResponse> {

  //   return this.http.post<ExpensesResponse>('expenses/findBySearch', expense)
  // }



}
