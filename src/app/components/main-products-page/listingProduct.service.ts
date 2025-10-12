import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap } from 'rxjs';

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

export interface Wishlist {
  id: number;
  listing_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistResponse {
  message: string;
  data: Wishlist[];
}

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'https://be.dabapp.co/api/';

  // Track wishlist state
  private wishlistSubject = new BehaviorSubject<number[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ========== LISTING METHODS ==========
  
  getListing(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}listings/${id}`);
  }

  getDraftListings(): Observable<{ message: string; data: any[] }> {
    return this.http.get<{ message: string; data: any[] }>(this.apiUrl + 'listings/draft');
  }

  getSingleDraft(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + `listings/draft/${id}`);
  }

  // ========== SOOM METHODS ==========

  submitSoom(listingId: number, amount: number): Observable<LastSoomResponse> {
    const url = `${this.apiUrl}listings/${listingId}/soom`;
    const body: SoomRequest = { amount };
    return this.http.post<LastSoomResponse>(url, body);
  }

  lastSoom(listingId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'listings/' + listingId + '/last-soom');
  }

  // ========== WISHLIST METHODS ==========

  /**
   * Get user's wishlist
   */
  getWishlists(): Observable<WishlistResponse> {
    return this.http.get<WishlistResponse>(this.apiUrl + 'wishlists').pipe(
      tap(response => {
        const wishlistIds = response.data.map(item => item.listing_id);
        this.wishlistSubject.next(wishlistIds);
      }),
      catchError(error => {
        console.error('Error fetching wishlists', error);
        return throwError(() => new Error('Failed to fetch wishlists'));
      })
    );
  }

  /**
   * Get a specific wishlist by ID
   */
  getWishlistById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}wishlists/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching wishlist', error);
        return throwError(() => new Error('Failed to fetch wishlist'));
      })
    );
  }

  /**
   * Add listing to wishlist
   */
  addToWishlist(listingId: number): Observable<any> {
    return this.http.post(this.apiUrl + 'wishlists', { listing_id: listingId }).pipe(
      tap(() => {
        const currentWishlist = this.wishlistSubject.value;
        this.wishlistSubject.next([...currentWishlist, listingId]);
      }),
      catchError(error => {
        console.error('Error adding to wishlist', error);
        return throwError(() => new Error('Failed to add to wishlist'));
      })
    );
  }

  /**
   * Remove listing from wishlist
   */
  removeFromWishlist(listingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}wishlists/${listingId}`).pipe(
      tap(() => {
        const currentWishlist = this.wishlistSubject.value;
        this.wishlistSubject.next(currentWishlist.filter(id => id !== listingId));
      }),
      catchError(error => {
        console.error('Error removing from wishlist', error);
        return throwError(() => new Error('Failed to remove from wishlist'));
      })
    );
  }

  /**
   * Update a wishlist
   */
  updateWishlist(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}wishlists/${id}`, data).pipe(
      catchError(error => {
        console.error('Error updating wishlist', error);
        return throwError(() => new Error('Failed to update wishlist'));
      })
    );
  }

  /**
   * Toggle wishlist status - adds or removes based on current status
   */
  toggleWishlist(listingId: number, currentStatus: boolean): Observable<any> {
    if (currentStatus) {
      return this.removeFromWishlist(listingId);
    } else {
      return this.addToWishlist(listingId);
    }
  }

  /**
   * Check if listing is in wishlist
   */
  isInWishlist(listingId: number): boolean {
    return this.wishlistSubject.value.includes(listingId);
  }

  /**
   * Load wishlist IDs into memory (call this on app initialization)
   */
  loadWishlistIds(): void {
    this.getWishlists().subscribe({
      next: () => console.log('Wishlist loaded'),
      error: (error) => console.error('Error loading wishlist', error)
    });
  }
}