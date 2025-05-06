import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bank_cards, CreateCardDto } from '../../interfaces/user-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankCardService {
  baseUrl = 'https://be.dabapp.co/api/';

  constructor(private http: HttpClient) { }

  addCard(cardsCriteria: CreateCardDto) :Observable<any> {
    return this.http.post(this.baseUrl + 'my-cards', cardsCriteria);

  }
  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}my-cards/${id}`);
  }
  setDefaultCard(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}my-cards/${id}/set-default`, {});
  }

}
