import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentManager, Departments, Employees } from '../../shared/models/model-classes.model';
import { HttpMethodService } from '../../shared/helper/http-method.service';

@Injectable({ providedIn: 'root' })
export class DepartmentManagerService {

  constructor(private http: HttpMethodService) {}

  getAllManagers(): Observable<DepartmentManager[]> {
    return this.http.get<DepartmentManager[]>('deptManager/findAll');
  }

  saveManager(manager: DepartmentManager): Observable<DepartmentManager> {
    return this.http.post<DepartmentManager>('deptManager/save', manager);
  }

  updateManager(manager: DepartmentManager): Observable<DepartmentManager> {
    return this.http.put<DepartmentManager>('deptManager/update', manager);
  }

  deleteManager(deptId: any, empId: any): Observable<any> {
    return this.http.delete(`deptManager/delete/${deptId}/${empId}`);
  }

  getAllDepartments(): Observable<Departments[]> {
    return this.http.get<Departments[]>('departments/findAll');
  }

  getAllEmployees(): Observable<Employees[]> {
    return this.http.get<Employees[]>('employees/findAll');
  }
}