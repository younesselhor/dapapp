import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftProductComponent } from './draft-product.component';

describe('DraftProductComponent', () => {
  let component: DraftProductComponent;
  let fixture: ComponentFixture<DraftProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
