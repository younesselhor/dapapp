import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSubmissionSuccessComponent } from './ad-submission-success.component';

describe('AdSubmissionSuccessComponent', () => {
  let component: AdSubmissionSuccessComponent;
  let fixture: ComponentFixture<AdSubmissionSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdSubmissionSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSubmissionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
