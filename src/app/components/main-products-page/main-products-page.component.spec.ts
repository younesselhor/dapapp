import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProductsPageComponent } from './main-products-page.component';

describe('MainProductsPageComponent', () => {
  let component: MainProductsPageComponent;
  let fixture: ComponentFixture<MainProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
