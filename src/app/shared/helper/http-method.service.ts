import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpHelperService } from './base-header.service';
import { BaseHttpService } from './base.http.service';

@Injectable({ providedIn: 'root' })
export class HttpMethodService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super(''); // default endpoint is empty
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  get<T>(path: string) {
    return this.http.get<T>(this.resolveUrl(path), {
      headers: HttpHelperService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('GET Error:', error);
        throw error;
      })
    );
  }

  post<T>(path: string, data: any) {
    return this.http.post<T>(this.resolveUrl(path), data, {
      headers: HttpHelperService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('POST Error:', error);
        throw error;
      })
    );
  }

  delete(path: string) {
    return this.http.delete(this.resolveUrl(path), {
      headers: HttpHelperService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('DELETE Error:', error);
        throw error;
      })
    );
  }

  upload<T>(path: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<T>(this.resolveUrl(path), formData, {
      headers: HttpHelperService.getAuthHeadersForFile()
    }).pipe(
      catchError(error => {
        console.error('UPLOAD Error:', error);
        throw error;
      })
    );
  }

  uploadProduct<T>(path: string, file: File, productId:any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);

    return this.http.post<T>(this.resolveUrl(path), formData, {
      headers: HttpHelperService.getAuthHeadersForFile()
    }).pipe(
      catchError(error => {
        console.error('UPLOAD Error:', error);
        throw error;
      })
    );
  }


}

