import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTabsComponent } from './account-tabs.component';

describe('AccountTabsComponent', () => {
  let component: AccountTabsComponent;
  let fixture: ComponentFixture<AccountTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
