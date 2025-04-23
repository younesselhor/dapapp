import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatesSectionComponent } from './plates-section.component';

describe('PlatesSectionComponent', () => {
  let component: PlatesSectionComponent;
  let fixture: ComponentFixture<PlatesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
