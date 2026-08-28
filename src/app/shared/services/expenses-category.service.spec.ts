import { TestBed } from '@angular/core/testing';

import { ExpensesCategoryService } from './expenses-category.service';

describe('ExpensesCategoryService', () => {
  let service: ExpensesCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
