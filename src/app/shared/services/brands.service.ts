import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Brands } from '../models/model-classes.model';
import { BaseHttpService } from '../helper/base.http.service';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({ providedIn: 'root' })

export class BrandsService  {
  constructor(private http: HttpMethodService) {
    // super('brands');
    // http.setEndpoint('brands');
  }

   // Save brand - automatically becomes 'apiUrl/brands/save'
  save(brandData: Brands): Observable<Brands> {
    return this.http.post<Brands>('brands/save', brandData);
  }

  // Get all brands - automatically becomes 'apiUrl/brands/findAll'
  getBrandsList(): Observable<Brands[]> {
    return this.http.get<Brands[]>(`brands/findAll`);
  }

  // Delete brand - automatically becomes 'apiUrl/brands/delete/123'
  delete(brandId: number): Observable<any> {
    return this.http.post<any>(`brands/delete/${brandId}`, {});
  }

  // Import brands - automatically becomes 'apiUrl/files/importBrands'
  importBrands(file: File): Observable<any> {
    return this.http.upload<any>('files/importBrands', file);
  }


  importBrands2(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`files/importBrands`);
  }
}