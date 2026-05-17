import { TestBed } from '@angular/core/testing';

import { WarehousService } from './warehous.service';

describe('WarehousService', () => {
  let service: WarehousService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehousService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
