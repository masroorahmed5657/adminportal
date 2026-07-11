import { TestBed } from '@angular/core/testing';

import { DeviceRegisterService } from './device-register.service';

describe('DeviceRegisterService', () => {
  let service: DeviceRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
