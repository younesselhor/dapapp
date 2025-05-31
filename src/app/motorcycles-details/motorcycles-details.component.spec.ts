import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorcyclesDetailsComponent } from './motorcycles-details.component';

describe('MotorcyclesDetailsComponent', () => {
  let component: MotorcyclesDetailsComponent;
  let fixture: ComponentFixture<MotorcyclesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotorcyclesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorcyclesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
