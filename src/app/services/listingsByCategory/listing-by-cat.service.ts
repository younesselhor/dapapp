import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Brand {
  id: number;
  name: string;
  listings_count: number;
  checked?: boolean;
}

interface BrandsResponse {
  motorcycle_brands: Brand[];
}
@Injectable({
  providedIn: 'root'
})
export class ListingByCatService {

  constructor(private http: HttpClient) { }
  baseUrl = 'https://be.dabapp.co/api/';

  getMotorcyclesByCategory(){
    return this.http.get(this.baseUrl + 'listings/by-category/1')
  }

  getBikePartByCategory(){
    return this.http.get(this.baseUrl + 'listings/by-category/2')
  }
  
  getPriceRange(cat:number){
    return this.http.get(this.baseUrl +'categories/'+cat+'/price-range')
  }

 getBrandsListing(): Observable<BrandsResponse> {
  return this.http.get<BrandsResponse>(this.baseUrl + 'brands/listings-count');
}
getBikePartsBrand(){
  return this.http.get(this.baseUrl + 'bike-part-brands')
}
getBikePartCatg(){
  return this.http.get(this.baseUrl + 'bike-part-categories')
}

filterMotorcycles(params: any): Observable<any> {
  // Convert brands array to the correct format (brands[]=7&brands[]=8)
  const queryParams = new URLSearchParams();
  
  queryParams.append('min_price', params.min_price);
  queryParams.append('max_price', params.max_price);
  
  if (params.brands && params.brands.length > 0) {
    params.brands.forEach((brandId: number) => {
      queryParams.append('brands[]', brandId.toString());
    });
  }
  
  if (params.condition) {
    queryParams.append('condition', params.condition);
  }

  return this.http.get(`${this.baseUrl}filter/motorcycles?${queryParams.toString()}`);
}

filterSpareParts(params: any): Observable<any> {
  // Convert array parameters to the correct format
  const queryParams = new URLSearchParams();
  
  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value: any) => {
        queryParams.append(`${key}[]`, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }
  
  return this.http.get(`${this.baseUrl}filter/spare-parts?${queryParams.toString()}`);
}


}

