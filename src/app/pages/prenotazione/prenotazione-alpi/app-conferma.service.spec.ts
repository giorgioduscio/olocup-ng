import { TestBed } from '@angular/core/testing';

import { AppConfermaService } from './app-conferma.service';

describe('AppConfermaService', () => {
  let service: AppConfermaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppConfermaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
