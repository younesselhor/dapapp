import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCardUserComponent } from './payment-card-user.component';

describe('PaymentCardUserComponent', () => {
  let component: PaymentCardUserComponent;
  let fixture: ComponentFixture<PaymentCardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCardUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
