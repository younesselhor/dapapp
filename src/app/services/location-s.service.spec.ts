import { TestBed } from '@angular/core/testing';

import { LocationSService } from './location-s.service';

describe('LocationSService', () => {
  let service: LocationSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
