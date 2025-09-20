import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotorcycleListing } from '../postingAdd-interface';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private baseUrl = 'https://be.dabapp.co/api/';
  private filterbaseUrl = '/api/motorcycle/brands';

  constructor(private http: HttpClient) { }

  // addPost(payload: FormData){
  //   return this.http.post(this.baseUrl , payload)
  // }
  // addPost(payload: any): Observable<any> {
  //   return this.http.post('/api/listings', payload);
  // }

  // // uploadImage(file: File): Observable<string> {
  // //   const formData = new FormData();
  // //   formData.append('image', file);

  // //   return this.http.post<string>('/api/upload', formData);
  // // }
  // uploadImage(file: File): Observable<{ url: string }> {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return this.http.post<{ url: string }>('/api/upload', formData);
  // }

  // addPost(payload: any): Observable<any> {
  //   return this.http.post('/api/listings', payload, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  // uploadImage(file: File): Observable<{ url: string }> {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return this.http.post<{ url: string }>('/api/upload', formData);
  // }
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl +'upload-image', formData);
  }

  addPost(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + 'listings', payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getBrandPartList(){
    return this.http.get<any>(`${this.baseUrl}bike-part-brands`);
  }
  getPartCategoryList(){
    return this.http.get<any>(`${this.baseUrl}bike-part-categories`);
  }

// In your listing service
getPricing(params: {
  model_id?: number,
  category_id?: number,
  country_id?: number,
  bike_part_category_id?: number
}): Observable<any> {
  return this.http.get(`${this.baseUrl}pricing`, { params });
}

checkPromo(body: { code: string, total_price: number }): Observable<any> {
  return this.http.post(`${this.baseUrl}promo/check`, body);
}
  /**
   * Create a new motorcycle listing
   * @param motorcycleData The motorcycle data to be submitted
   * @returns Observable with the API response
   */
  // createMotorcycleListing(motorcycleData: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/motorcycles`, motorcycleData);
  // }
  // createMotorcycleListing(data: MotorcycleListing): Observable<any> {
  //   return this.http.post(`${this.baseUrl}`, data);
  // }
  createMotorcycleListing(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }


  /**
   * Create a new bike part listing
   * @param bikePartData The bike part data to be submitted
   * @returns Observable with the API response
   */
  createBikePartListing(bikePartData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/parts`, bikePartData);
  }

  /**
   * Create a new license plate listing
   * @param licensePlateData The license plate data to be submitted
   * @returns Observable with the API response
   */
  createLicensePlateListing(licensePlateData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/plates`, licensePlateData);
  }

  getMotorcycleFilters(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<any>(this.baseUrl +this.filterbaseUrl, { params: httpParams });
  }

  getMotorcycleBrands(): Observable<any> {
  return this.http.get<any>(this.baseUrl + 'motorcycle/brands');
}

getMotorcycleModels(brandId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}motorcycle/models/${brandId}`);
}

getMotorcycleYears(modelId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}motorcycle/years/${modelId}`);
}

  getCityList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}locations`);
  }


  getPlateFormat(cityId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}cities/${cityId}/plate-formats/details`);
}

getSingleDraft(id: number): Observable<{ data: any }> {
  return this.http.get<{ data: any }>(this.baseUrl +`listings/draft/${id}`);
}

getCountry(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}get-country`);
}

checkPaymentStatus(paymentId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}payment/status/${paymentId}`);
}

// getSingleDraft(id: number):Observable<any[]> {
//   return this.http.get<any[]>(this.baseUrl +`listings/draft/${id}`);
// }
getWishlist(): Observable<any> {
  return this.http.get<any>(this.baseUrl + 'wishlists');
}
}
