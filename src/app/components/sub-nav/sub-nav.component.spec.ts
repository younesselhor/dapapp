import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubNavComponent } from './sub-nav.component';

describe('SubNavComponent', () => {
  let component: SubNavComponent;
  let fixture: ComponentFixture<SubNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
