import { TestBed } from '@angular/core/testing';

import { SharedFormDataService } from './shared-form-data.service';

describe('SharedFormDataService', () => {
  let service: SharedFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
