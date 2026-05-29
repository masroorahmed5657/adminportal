import { TestBed } from '@angular/core/testing';

import { CashierShiftService } from './cashier-shift.service';

describe('CashierShiftService', () => {
  let service: CashierShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashierShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
