import { TestBed } from '@angular/core/testing';

import { AppPazienteService } from './app-paziente.service';

describe('AppPazienteService', () => {
  let service: AppPazienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppPazienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
