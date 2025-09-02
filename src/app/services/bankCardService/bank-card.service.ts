import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bank_cards, CreateCardDto } from '../../interfaces/user-interface';
import { Observable } from 'rxjs';


// types.ts
export interface Payment {
  id: number;
  user_id: number;
  listing_id: number;
  amount: string;
  payment_method_id: number | null;
  bank_card_id: number | null;
  payment_status: string;
  tran_ref: string;
  cart_id: string;
  resp_code: string | null;
  resp_message: string | null;
  verification_data: any;
  created_at: string;
  updated_at: string;
  total_amount: string | null;
  discounted_amount: string | null;
  currency: string;
  promo_code_id: number | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  listing: {
    id: number;
    title: string;
    description: string;
    price: string;
  };
  payment_method: any;
  bank_card: any;
}

export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: {
    payments: Payment[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
    statistics: {
      total_payments: number;
      completed_payments: number;
      pending_payments: number;
      failed_payments: number;
      total_amount: string;
      average_amount: string;
    };
  };
}
@Injectable({
  providedIn: 'root'
})
export class BankCardService {
  baseUrl = 'https://be.dabapp.co/api/';

  constructor(private http: HttpClient) { }

  // addCard(cardsCriteria: CreateCardDto) :Observable<any> {
  //   return this.http.post(this.baseUrl + 'my-cards', cardsCriteria);
  // }
  addCard(cardsCriteria: CreateCardDto): Observable<{ message: string; data: bank_cards }> {
    return this.http.post<{ message: string; data: bank_cards }>(
      this.baseUrl + 'my-cards',
      cardsCriteria
    );
  }
  getCards(): Observable<bank_cards[]> {
    return this.http.get<bank_cards[]>(this.baseUrl + 'my-cards');
  }
  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}my-cards/${id}`);
  }

  setDefaultCard(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}my-cards/${id}/set-default`, {});
  }

  // getPaymentHistory(){
  //   return this.http.get(this.baseUrl + 'payments/history/user');
  // }
    getPaymentHistory(): Observable<PaymentHistoryResponse> {
    return this.http.get<PaymentHistoryResponse>(this.baseUrl + 'payments/history/user');
  }
}

