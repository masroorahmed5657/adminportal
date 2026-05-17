import { TestBed } from '@angular/core/testing';

import { ReceiveProductService } from './receive-product.service';

describe('ReceiveProductService', () => {
  let service: ReceiveProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiveProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
