import { TestBed } from '@angular/core/testing';

import { RazonamientologService } from './razonamientolog.service';

describe('RazonamientologService', () => {
  let service: RazonamientologService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazonamientologService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
