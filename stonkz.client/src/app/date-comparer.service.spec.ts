import { TestBed } from '@angular/core/testing';

import { DateComparerService } from './date-comparer.service';

describe('DateComparerService', () => {
  let service: DateComparerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateComparerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
