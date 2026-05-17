import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  constructor() { }
  // Utility function
  static getToken(): string {
    return sessionStorage.getItem('Token') || localStorage.getItem('Token') || '';
  }

  // For standard JSON requests
  static getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
  }

  // For file uploads (without Content-Type)
  static getAuthHeadersForFile(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token
    });
  }

  // For requests that need different content types
  static getAuthHeadersWithContentType(contentType: string): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': contentType,
      'Authorization': token
    });
  }

}