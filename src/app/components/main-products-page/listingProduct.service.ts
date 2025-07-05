import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


export interface SoomRequest {
  amount: number;
}

export interface SoomResponse {
 id: number;
  listing_id: number;
  user_id: number;
  amount: string;
  submission_date: string;
  status: string;
  min_soom: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  listing: {
    id: number;
    title: string;
    description: string;
    seller_id: number;
  };
}

// Define interfaces for type safety
interface LastSoomData {
  id: number;
  listing_id: number;
  user_id: number;
  amount: string;
  submission_date: string;
  status: string;
  min_soom: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  listing: {
    id: number;
    title: string;
    description: string;
    seller_id: number;
  };
}

interface LastSoomResponse {
  message: string;
  data: LastSoomData;
  has_sooms: boolean;
  total_sooms_count: number;
}
@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'https://be.dabapp.co/api/';

  constructor(private http: HttpClient) { }

  getListing(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}listings/${id}`);
  }

  toggleWishlist(listingId: number): Observable<any> {
    return this.http.post(this.apiUrl +'wishlists', { listing_id: listingId }).pipe(
      catchError(error => {
        console.error('Error updating wishlist', error);
        return throwError(() => new Error('Failed to update wishlist'));
      })
    );
  }

  submitSoom(listingId: number, amount: number): Observable<LastSoomResponse> {
    const url = `${this.apiUrl}listings/${listingId}/soom`;
    const body: SoomRequest = { amount };
    
    return this.http.post<LastSoomResponse>(url, body);
  }

  lastSoom(listingId:number){
    return this.http.get(this.apiUrl + 'listings/'+listingId+'/last-soom')
  }

}