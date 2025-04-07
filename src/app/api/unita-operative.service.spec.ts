import { TestBed } from '@angular/core/testing';

import { UnitaOperativeService } from './unita-operative.service';

describe('UnitaOperativeService', () => {
  let service: UnitaOperativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitaOperativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
