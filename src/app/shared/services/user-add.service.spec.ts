import { TestBed } from '@angular/core/testing';

import { UseraddService } from './user-add.service';

describe('UseraddService', () => {
  let service: UseraddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseraddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
