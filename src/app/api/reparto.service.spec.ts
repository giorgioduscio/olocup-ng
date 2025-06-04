import { TestBed } from '@angular/core/testing';

import { RepartoService } from './reparto.service';

describe('RepartoService', () => {
  let service: RepartoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepartoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
