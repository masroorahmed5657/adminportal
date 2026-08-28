import { TestBed } from '@angular/core/testing';

import { OrdernumberService } from './ordernumber.service';

describe('OrdernumberService', () => {
  let service: OrdernumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdernumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
