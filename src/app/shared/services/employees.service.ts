import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { Employees } from '../../shared/models/model-classes.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpMethodService) { }

  getEmployeesList(): Observable<Employees[]> {
    return this.http.get<Employees[]>('employees/findAll');
  }

  save(employee: Employees): Observable<Employees> {
    return this.http.post<Employees>('employees/save', employee);
  }

  delete(empId: number): Observable<any> {
    return this.http.post<any>(`employees/delete/${empId}`, {});
  }
}