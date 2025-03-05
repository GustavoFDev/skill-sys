import { TestBed } from '@angular/core/testing';

import { ConteofigService } from './conteofig.service';

describe('ConteofigService', () => {
  let service: ConteofigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConteofigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
