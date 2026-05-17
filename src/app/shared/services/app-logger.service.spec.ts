import { TestBed } from '@angular/core/testing';

import { AppLoggerService } from './app-logger.service';

describe('AppLoggerService', () => {
  let service: AppLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
