import { TestBed } from '@angular/core/testing';


import { TipiStruttureService } from './tipi-strutture.service';

describe('TipiStruttureService', () => {
  let service: TipiStruttureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipiStruttureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
