import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { ErrorLogs } from '../models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogsService {

    private myUrl = environment.apiUrl

  constructor(private http: HttpMethodService, private http2: HttpClient) {

  }

  getList(): Observable<ErrorLogs[]> {

    return this.http.get<ErrorLogs[]>(`errorlogs/findAll`)

  }

  deleteLog(logId: any): Observable<any> {

    return this.http.delete(`errorlogs/delete/${logId}`); 
  }


}
