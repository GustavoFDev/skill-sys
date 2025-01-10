import { TestBed } from '@angular/core/testing';

import { QuestionscpService } from './questionscp.service';

describe('QuestionscpService', () => {
  let service: QuestionscpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionscpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
