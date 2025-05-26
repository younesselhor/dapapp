import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedFormDataService {

  constructor() { }
  private step1Data: any = null;
  private step2Data: any = null;

  setStep1Data(data: any) {
    this.step1Data = data;
  }

  getStep1Data(): any {
    return this.step1Data;
  }

  setStep2Data(data: any) {
    this.step2Data = data;
  }

  getStep2Data(): any {
    return this.step2Data;
  }

  getCombinedData(): any {
    return {
      ...this.step1Data,
      ...this.step2Data
    };
  }

  resetFormData() {
    this.step1Data = null;
    this.step2Data = null;
  }
}
