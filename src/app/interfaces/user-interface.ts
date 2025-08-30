
export interface OtpLoginResponse {
  user: AuthUser;
  token: string;
  token_expiration: string;
}



export interface LoginRequest {
  login: string;
  password: string;
}

export interface UserInterface {
  email: string;
  login?: string;
  token: string;
  username: string;
  requiresOTP: boolean;
  phone: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string | null;
  gender: string | null;
  profile_picture: string | null;
  address: string | null;
  postal_code: string | null;
  verified: number;
  is_active: number;
  is_online: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_id: number;
  language: string;
  timezone: string | null;
  two_factor_enabled: number;
  country_id: string | null;
}
export interface RegistrationRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

export interface RegistrationResponse {
  message: string;
  user: RegisteredUser;
  token: string;
  requiresOTP?: boolean;
  user_id?: number;
  country?: string;
  country_code?: string;
  country_id?: number;
  formatted_phone?: string;
  otp_sent_via?: string; // 'email' | 'whatsapp'
  expires_at?: string;
}

export interface RegisteredUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface MeResponse {
  
  user: AuthUserDetails;
}

export interface AuthUserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string | null;
  gender: string | null;
  profile_picture: string | null;
  address: string | null;
  postal_code: string | null;
  verified: number;
  is_active: number;
  is_online: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_id: number;
  language: string;
  timezone: string | null;
  two_factor_enabled: number;
  country_id: string | null;
  bank_cards: bank_cards[];
  wishlists: Wishlist[];
  listings: Listing[];
  auction_histories_as_seller: any[];
  auction_histories_as_buyer: any[];
}

export interface Vehicle {
  type: string;
  model: string;
  year: number;
  make: string;
}
export interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  seller_id: number;
  category_id: number;
  country_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  auction_enabled: number;
  minimum_bid: string;
  allow_submission: number;
  listing_type_id: number;
  // UI properties
  rating?: number;
  images: ListingImage[];
}

export interface ListingImage {
  id: number;
  image_url: string;
  listing_id: number;
  created_at: string | null;
  updated_at: string | null;
}
export interface Wishlist {
  id: number;
  user_id: number;
  listing_id: number;
  created_at: string;
  listing: Listing;
}
export interface bank_cards {
  id: string;
  user_id: number;
  card_type_id: number;
  card_number: string;
  card_holder_name: string;
  expiration_date: string;
  cvv: string;
  created_at: string;
  is_default: boolean;
  updated_at: string;
}



export interface CreateCardDto {
  card_type_id: number;
  card_number: string;
  card_holder_name: string;
  expiration_date: string;
  cvv: string;
}
