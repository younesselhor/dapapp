export interface UserInterface {
//   // id: number;
//   firstName: string;
//   lastName: string;
//   password: string;
//   confirmPassword: string;
//   // phoneNumber: string;
//   // address: string;
//   // city: string;
//   // country: string;
//   // postalCode: string;
//   // dateOfBirth: Date;
//   identifier: string;
//   email: string;
//  phoneNumber: string;
//   token: string;
//   username: string;
email: string;
login: string;
token: string;
username: string;
requiresOTP:number;
phone:number
user: AuthUser;
}

export interface LoginResponse {
  token: string;
  user: UserInterface;

}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday : string | null;
  gender:string | null;
  profile_picture : string | null;
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

export interface OtpLoginResponse {
  user: AuthUser;
  token: string;
  token_expiration: string;
}

