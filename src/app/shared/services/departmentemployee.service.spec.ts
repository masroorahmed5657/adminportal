import { TestBed } from '@angular/core/testing';

import { DepartmentemployeeService } from './departmentemployee.service';

describe('DepartmentemployeeService', () => {
  let service: DepartmentemployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentemployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
