export interface CreateEstablishmentInterface {
  socialReason: string;
  name: string;
  responsible: string;
  logo: string;
  headerImg: string;
  legalId: string;
  category: string;
  subcategory: string;
  licensedUuid: string;
  referral: string;
  commission: number;
  description: string;
  phone: string;
  secondPhone: string;
  whatsapp: string;
  email: string;
  status: string;
  cep: string;
  neighborhood: string;
  city: string;
  state: string;
  street: string;
  number: number;
  country: string;
  complement: string[250];
  lat: string;
  lng: string;
  rating: null;
  accessToken: string;
}

export interface CreateOperatorInterface {
  name: string;
  legalId: string;
  phone: string;
  email: string;
  accessToken: string;
}
