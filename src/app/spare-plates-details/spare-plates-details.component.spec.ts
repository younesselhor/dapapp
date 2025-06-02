import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePlatesDetailsComponent } from './spare-plates-details.component';

describe('SparePlatesDetailsComponent', () => {
  let component: SparePlatesDetailsComponent;
  let fixture: ComponentFixture<SparePlatesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparePlatesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SparePlatesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
