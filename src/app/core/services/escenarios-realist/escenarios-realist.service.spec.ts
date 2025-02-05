import { TestBed } from '@angular/core/testing';

import { EscenariosRealistService } from './escenarios-realist.service';

describe('EscenariosRealistService', () => {
  let service: EscenariosRealistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscenariosRealistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
