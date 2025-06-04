import { TestBed } from '@angular/core/testing';

import { StoricoPazienteService } from './storico-paziente.service';

describe('StoricoPazienteService', () => {
  let service: StoricoPazienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoricoPazienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
