import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentEmployee, Departments, DeptEmpResponse, Employees } from '../../shared/models/model-classes.model';
import { HttpMethodService } from '../../shared/helper/http-method.service';

@Injectable({ providedIn: 'root' })
export class DepartmentEmployeeService {

  constructor(private http: HttpMethodService) {}

  getAllDeptEmployees(): Observable<DeptEmpResponse[]> {
    return this.http.get<DeptEmpResponse[]>('deptEmployee/findAll');
  }

  getAlllDeptEmployeesByDeptId(deptId: any): Observable<DeptEmpResponse[]> {
    return this.http.get<DeptEmpResponse[]>(`deptEmployee/findByDept/${deptId}`);
  }


  saveDeptEmployee(deptEmp: DepartmentEmployee): Observable<DepartmentEmployee> {
    return this.http.post<DepartmentEmployee>('deptEmployee/save', deptEmp);
  }

  updateDeptEmployee(deptEmp: DepartmentEmployee): Observable<DepartmentEmployee> {
    return this.http.put<DepartmentEmployee>('deptEmployee/update', deptEmp);
  }

  deleteDeptEmployee(deptId: any, empId: any): Observable<any> {
    return this.http.delete(`deptEmployee/delete/${deptId}/${empId}`);
  }

  getAllDepartments(): Observable<Departments[]> {
    return this.http.get<Departments[]>('departments/findAll');
  }

  getAllEmployees(): Observable<Employees[]> {
    return this.http.get<Employees[]>('employees/findAll');
  }

  getEmployeesByDept(deptId: any): Observable<DepartmentEmployee[]> {
    return this.http.get<DepartmentEmployee[]>(`deptEmployee/findByDept/${deptId}`);
  }
}