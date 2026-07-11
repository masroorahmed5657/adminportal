import { TestBed } from '@angular/core/testing';

import { ErrorLogsService } from './error-logs.service';

describe('ErrorLogsService', () => {
  let service: ErrorLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
