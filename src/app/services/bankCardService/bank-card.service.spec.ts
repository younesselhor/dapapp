import { TestBed } from '@angular/core/testing';

import { BankCardService } from './bank-card.service';

describe('BankCardService', () => {
  let service: BankCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
