export interface MotorcycleListing {
  listing_type_id: number;
  vehicleType: string;
  details: {
    brand: string;
    modelYear: string;
    bodyCondition: string;
    isModified: boolean;
    hasInsurance: boolean;
    condition: string;
    vehicleCare: string;
    engineCapacity: number;
    kilometer: number;
    transmission: string;
  };
  ad: {
    title: string;
    description: string;
    price: number;
    city: string;
    sellerType: string;
    contactPreferences: {
      direct: boolean;
      soom: boolean;
      phone: boolean;
      whatsapp: boolean;
    };
  };
  images: string[];
  agreeToTerms: boolean;
}
