import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoomBoxComponent } from './soom-box.component';

describe('SoomBoxComponent', () => {
  let component: SoomBoxComponent;
  let fixture: ComponentFixture<SoomBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoomBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoomBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
