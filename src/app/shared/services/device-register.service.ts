import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { DeviceRegister } from '../models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceRegisterService {

  
    private myUrl = environment.apiUrl

  constructor(private http: HttpMethodService, private http2: HttpClient) {

    // super('category');
    // http.setEndpoint('category');
  }

  getList(): Observable<DeviceRegister[]> {

    return this.http.get<DeviceRegister[]>(`deviceRegister/findAll`)

  }

  delete(logId: any): Observable<any> {

    return this.http.delete(`deviceRegister/delete/${logId}`); 
  }

  save(deviceRegister: DeviceRegister){
    return this.http.post<DeviceRegister>('deviceRegister/save', deviceRegister);
  }
}
