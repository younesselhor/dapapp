import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedVehiclesComponent } from './saved-vehicles.component';

describe('SavedVehiclesComponent', () => {
  let component: SavedVehiclesComponent;
  let fixture: ComponentFixture<SavedVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
