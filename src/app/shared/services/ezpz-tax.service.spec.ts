import { TestBed } from '@angular/core/testing';

import { EzpzTaxService } from './ezpz-tax.service';

describe('EzpzTaxService', () => {
  let service: EzpzTaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EzpzTaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
