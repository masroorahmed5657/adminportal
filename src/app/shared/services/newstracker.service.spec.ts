import { TestBed } from '@angular/core/testing';

import { NewstrackerService } from './newstracker.service';

describe('NewstrackerService', () => {
  let service: NewstrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewstrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
