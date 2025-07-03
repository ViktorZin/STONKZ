import { TestBed } from '@angular/core/testing';

import { StonkzService } from './stonkz.service';

describe('StonkzService', () => {
  let service: StonkzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StonkzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
