import { Injectable } from '@angular/core';

import { Customer, CustomerType, Address, Category, Country, CountryStateProvince, StateProvince, CustomerRequest, City, CustomerResponse } from '../models/model-classes.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppLoggerService } from './app-logger.service';
import { environment } from '../../../environments/environment';
import { Errors } from '../errors/errors'
import { BaseHttpService } from '../helper/base.http.service';
import { HttpMethodService } from '../helper/http-method.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  

  private url = environment.apiUrl; //http://localhost:9080/EZPZ_WS/customer
  private errors: Errors = new Errors();

  constructor(private http: HttpMethodService,
    private appLogService: AppLoggerService) {
    // super('customer')
    // this.http.setEndpoint('customer')

  }

  

  deleteCustomer(custId: any): Observable<any> {
    return this.http.delete(`customer/delete/${custId}`);
  
  }

  saveCustomer(customer: CustomerRequest): Observable<CustomerResponse> {

    return this.http.post<CustomerResponse>('customer/save', customer)

  }

  /* ****************************************************************** */
  updateCustomer(customer: CustomerRequest): Observable<number> {

    return this.http.post<number>('customer/save', customer)

  }
  /* ****************************************************************** */
  saveAddress(address: Address): Observable<Address> {

    return this.http.post<Address>('customer/save', address)

  }

  /* ****************************************************************** */
  getCustomerTypeList(): Observable<CustomerType[]> {

    let myUrl = `${this.url}` + `customerTypes/findAllCustomerType`;


    return this.http.get<CustomerType[]>('customerTypes/findAllCustomerType')
  }
  /* ****************************************************************** */
  getCategoryList(): Observable<Category[]> {

    return this.http.get<Category[]>('category/findAllCategories')
  }
  /* ********************************************************************** */
  getCountryList(): Observable<Country[]> {

    return this.http.get<Country[]>('country/findAll')
  }
  /* ********************************************************************** */
  getProvinceCityList(countryId: any): Observable<StateProvince[]> {

    return this.http.get<StateProvince[]>(`stateProvince/findAllByCountryId/${countryId}`)
  }

  /* ********************************************************************** */
  getCityList(countryId: Number): Observable<City[]> {

    return this.http.get<City[]>(`city/findAllByStateId/${countryId}`)
  }

  /* ********************************************************************** */
  getProvinceList(): Observable<StateProvince[]> {

    return this.http.get<StateProvince[]>('stateProvince/findAllState')
  }
  /* ****************************************************************** */
  getAllCustomers(): Observable<Customer[]> {

    return this.http.get<Customer[]>('customer/findAllCustomer')
  }

  /* ********************************************************************** */

  // error in these api !

  // getAPI(): Observable<any> {

  //   let myUrl = `https://www.universal-tutorial.com/api/getaccesstoken`;

  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //     .set('Access-Control-Allow-Origin', '*')
  //     .set('api-token', 'G6IQ20qqCQxpoEBXZz4bawPYcujL47gdZlMpiCjMpaAXvpBqAFXzIpOoMERBDafXMjs')
  //     .set('user-email', 'info@techmaci.com');

  //   return this.http.get<string>(myUrl, { headers }).pipe(
  //     //tap( error ==> this.log('Fetched Countries') ),
  //     catchError(this.errors.handleError<string>('getAPI'))
  //   );

  // }

  // getAPIFree(): Observable<any> {

  //   let myUrl = `https://www.pwrc.usgs.gov/bbl/manual/country_codes.cfm`;

  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //     .set('Access-Control-Allow-Origin', '*');



  //   return this.http.get<string>(myUrl, { headers }).pipe(
  //     //tap( error ==> this.log('Fetched Countries') ),
  //     catchError(this.errors.handleError<string>('getAPI'))
  //   );

  // }

  // getAPICountries(): Observable<any> {

  //   let myUrl = `https://www.universal-tutorial.com/api/countries/`;

  //   const headers = new HttpHeaders()
  //     .set('Accept', 'application/json')
  //     .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7I…zI0fQ.oK4sdkwZYMiU4J0wlpxHstNIidV28L6y3R7XPUymA9M');


  //   return this.http.get<string>(myUrl, { headers }).pipe(
  //     //tap( error ==> this.log('Fetched Countries') ),
  //     catchError(this.errors.handleError<string>('getAPI'))
  //   );

  // } 


}
