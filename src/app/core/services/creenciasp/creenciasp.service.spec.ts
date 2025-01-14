import { TestBed } from '@angular/core/testing';

import { CreenciaspService } from './creenciasp.service';

describe('CreenciaspService', () => {
  let service: CreenciaspService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreenciaspService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
