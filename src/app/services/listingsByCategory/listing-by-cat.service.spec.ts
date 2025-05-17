import { TestBed } from '@angular/core/testing';

import { ListingByCatService } from './listing-by-cat.service';

describe('ListingByCatService', () => {
  let service: ListingByCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingByCatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
