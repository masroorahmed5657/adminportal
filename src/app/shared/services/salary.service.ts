// salary.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethodService } from '../helper/http-method.service';
import { environment } from '../../../environments/environment';
import { Salary, SalaryView } from '../models/model-classes.model';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private apiUrl = environment.apiUrl; // e.g., http://localhost:8080/FASHION_API/

  constructor(private http: HttpMethodService) {}

  // Save new salary
  saveSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>('salary/save', salary);
  }

  // Update existing salary
  updateSalary(salary: Salary): Observable<Salary> {
    return this.http.put<Salary>('salary/update', salary);
  }

  // Get all salaries (returns SalaryView list for display)
  getAllSalaries(): Observable<SalaryView[]> {
    return this.http.get<SalaryView[]>('salary/findAll');
  }

  // Get single salary by ID
  getSalaryById(id: number): Observable<Salary> {
    return this.http.get<Salary>(`salary/find/${id}`);
  }

  // Delete salary
  deleteSalary(id: number): Observable<any> {
    return this.http.delete(`salary/delete/${id}`);
  }
}