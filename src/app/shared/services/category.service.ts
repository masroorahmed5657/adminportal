import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Category, FinanceCategory } from '../models/model-classes.model';
import { HttpMethodService } from '../helper/http-method.service';
import { BaseHttpService } from '../helper/base.http.service';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpHelperService } from '../helper/base-header.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private myUrl = environment.apiUrl

  constructor(private http: HttpMethodService, private http2: HttpClient) {

    // super('category');
    // http.setEndpoint('category');
  }

  getCategoryList(): Observable<Category[]> {

    return this.http.get<Category[]>(`category/findAll`)

  }

  /* ************************************************************* */
  saveCategory(category: Category): Observable<Category> {

    return this.http.post<Category>('category/save', category)

  }
  /* ************************************************************* */
  deleteCategory(categoryId: any): Observable<any> {

    return this.http.delete(`category/delete/${categoryId}`)

  }
  /* ************************************************************* */
  deleteImage(categoryId: any): Observable<any> {

    return this.http.delete(`category/deleteImage/${categoryId}`)

  }

    /* ********************* */
  importCategory(file: File): Observable<ApiResponse> {
  
      return this.http.upload<any>('files/importCategory', file);
  }
  
  /* ************************************************************* */

  // upload(file: File, categoryId: any): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);
  //   formData.append('categoryId', categoryId);

  //   const req = new HttpRequest('POST', `category/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //   });

  //   return this.http2.request(req);
  // }


  upload(file: File, categoryId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', categoryId);

    const headers = HttpHelperService.getAuthHeadersForFile(); // ✅ add auth header

    const req = new HttpRequest('POST', `${this.myUrl}category/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: headers
    });

    return this.http2.request(req);
  }



  /* ***************************************************************** */
  getFinanceCategoryList(): Observable<FinanceCategory[]> {

    return this.http.get<FinanceCategory[]>('category/findAllFinanceCategories');

  }



}

