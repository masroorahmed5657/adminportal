import { TestBed } from '@angular/core/testing';

import { CheckoutService } from './checkout-service.service';

describe('CheckoutServiceService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
