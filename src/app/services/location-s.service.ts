// location.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { ICountry } from './interfaces'; // أو عرفها هنا مباشرة
interface ICountry {
  id: number;
  name: string;
  code: string;
}
@Injectable({
  providedIn: 'root',
})
export class LocationSService {
  private selectedCountrySubject = new BehaviorSubject<ICountry | null>(null);
  selectedCountry$ = this.selectedCountrySubject.asObservable();

  setSelectedCountry(country: ICountry) {
    this.selectedCountrySubject.next(country);
  }

  getSelectedCountry(): ICountry | null {
    return this.selectedCountrySubject.value;
  }
}

