import { Injectable } from '@angular/core';

import {
  Customer,
  CustomerType,
  Address,
  Category,
  Country,
  StateProvince,
  CustomerRequest,
  City,
  CustomerResponse
} from '../models/model-classes.model';

import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { AppLoggerService } from './app-logger.service';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors';
import { HttpMethodService } from '../helper/http-method.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.apiUrl;
  private errors: Errors = new Errors();

  constructor(
    private http: HttpMethodService,
    private appLogService: AppLoggerService
  ) {}

  /* ****************************************************************** */
  deleteCustomer(custId: any): Observable<any> {
    return this.http.delete(`customer/delete/${custId}`);
  }

  /* ****************************************************************** */
  saveCustomer(customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>('customer/save', customer);
  }

  /* ****************************************************************** */
  updateCustomer(customer: CustomerRequest): Observable<number> {
    return this.http.post<number>('customer/save', customer);
  }

  /* ****************************************************************** */
  saveAddress(address: Address): Observable<Address> {
    return this.http.post<Address>('customer/save', address);
  }

  /* ****************************************************************** */
  getCustomerTypeList(): Observable<CustomerType[]> {
    return this.http.get<CustomerType[]>('customerTypes/findAllCustomerType');
  }

  /* ****************************************************************** */
  getCategoryList(): Observable<Category[]> {
    return this.http.get<Category[]>('category/findAllCategories');
  }

  /* ****************************************************************** */
  getCountryList(): Observable<Country[]> {
    return this.http.get<Country[]>('country/findAll');
  }

  /* ****************************************************************** */
  getProvinceCityList(countryId: any): Observable<StateProvince[]> {
    return this.http.get<StateProvince[]>(`stateProvince/findAllByCountryId/${countryId}`);
  }

  /* ****************************************************************** */
  getCityList(countryId: Number): Observable<City[]> {
    return this.http.get<City[]>(`city/findAllByStateId/${countryId}`);
  }

  /* ****************************************************************** */
  getProvinceList(): Observable<StateProvince[]> {
    return this.http.get<StateProvince[]>('stateProvince/findAllState');
  }

  /* ****************************************************************** */
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>('customer/findAllCustomer');
  }

  // ===============================
  // External APIs (currently unused)
  // ===============================

  /*
  getAPI(): Observable<any> {

    const myUrl = `https://www.universal-tutorial.com/api/getaccesstoken`;

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('api-token', 'YOUR_API_TOKEN')
      .set('user-email', 'info@techmaci.com');

    return this.http.get<string>(myUrl, { headers }).pipe(
      catchError(this.errors.handleError<string>('getAPI'))
    );
  }
  */

}