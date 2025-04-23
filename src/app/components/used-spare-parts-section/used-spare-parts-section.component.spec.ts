import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedSparePartsSectionComponent } from './used-spare-parts-section.component';

describe('UsedSparePartsSectionComponent', () => {
  let component: UsedSparePartsSectionComponent;
  let fixture: ComponentFixture<UsedSparePartsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsedSparePartsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsedSparePartsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
