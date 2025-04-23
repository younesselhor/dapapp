import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() {}

  validatePhoneNumber(phone: string): boolean {
    // Simple validation for Saudi phone numbers
    const phonePattern = /^\+966\d{9}$/;
    return phonePattern.test(phone);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    return typeof password === 'string' && password.length >= 6;
  }
}
