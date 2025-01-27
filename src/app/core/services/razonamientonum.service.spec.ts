import { TestBed } from '@angular/core/testing';

import { RazonamientonumService } from './razonamientonum.service';

describe('RazonamientonumService', () => {
  let service: RazonamientonumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazonamientonumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
