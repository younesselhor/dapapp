import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListingByCatService {

  constructor(private http: HttpClient) { }
  baseUrl = 'https://be.dabapp.co/api/listings/by-category/';

  getMotorcyclesByCategory(){
    return this.http.get(this.baseUrl + '1')
  }
}
