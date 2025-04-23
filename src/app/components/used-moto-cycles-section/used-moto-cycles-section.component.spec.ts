import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedMotoCyclesSectionComponent } from './used-moto-cycles-section.component';

describe('UsedMotoCyclesSectionComponent', () => {
  let component: UsedMotoCyclesSectionComponent;
  let fixture: ComponentFixture<UsedMotoCyclesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsedMotoCyclesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsedMotoCyclesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
