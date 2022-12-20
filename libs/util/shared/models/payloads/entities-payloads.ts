export class LoginPayload {
  login: string;
  pass: string;
  apiKey: string;
  apiSecret: string;
  constructor(login: string, pass: string, apiKey: string, apiSecret: string) {
    this.login = login;
    this.pass = pass;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
}

export class AdminPayload {
  user: string;
  constructor(user: string) {
    this.user = user;
  }
}

export class AcceptTermsPayload {
  entityUuid: string;
  version: string;
  accessToken: string;
  constructor(entityUuid: string, version: string, accessToken: string) {
    this.entityUuid = entityUuid;
    this.version = version;
    this.accessToken = accessToken;
  }
}

export class QueryOperatorPayload {
  establishmentUuid: string;
  operatorUuid: string;
  constructor(establishmentUuid: string, operatorUuid: string) {
    this.establishmentUuid = establishmentUuid;
    this.operatorUuid = operatorUuid;
  }
}

export class ChangePasswordPayload {
  entityUuid: string;
  newPassword: string;
  oldPassword: string;
  accessToken: string;
  constructor(
    entityUuid: string,
    newPassword: string,
    oldPassword: string,
    accessToken: string
  ) {
    this.entityUuid = entityUuid;
    this.newPassword = newPassword;
    this.oldPassword = oldPassword;
    this.accessToken = accessToken;
  }
}

export class EntityPayload {
  uuid: string;
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
  cpf: string;
  constructor(
    uuid: string,
    socialReason: string,
    name: string,
    responsible: string,
    logo: string,
    headerImg: string,
    legalId: string,
    category: string,
    subcategory: string,
    licensedUuid: string,
    referral: string,
    commission: number,
    description: string,
    phone: string,
    secondPhone: string,
    whatsapp: string,
    email: string,
    status: string,
    cep: string,
    neighborhood: string,
    city: string,
    state: string,
    street: string,
    number: number,
    country: string,
    complement: string[250],
    lat: string,
    lng: string,
    rating: null,
    accessToken: string,
    cpf: string
  ) {
    this.uuid = uuid;
    this.socialReason = socialReason;
    this.name = name;
    this.responsible = responsible;
    this.logo = logo;
    this.headerImg = headerImg;
    this.legalId = legalId;
    this.category = category;
    this.subcategory = subcategory;
    this.licensedUuid = licensedUuid;
    this.referral = referral;
    this.commission = commission;
    this.description = description;
    this.phone = phone;
    this.secondPhone = secondPhone;
    this.whatsapp = whatsapp;
    this.email = email;
    this.status = status;
    this.cep = cep;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.street = street;
    this.number = number;
    this.country = country;
    this.complement = complement;
    this.lat = lat;
    this.lng = lng;
    this.rating = rating;
    this.accessToken = accessToken;
    this.cpf = cpf;
  }
}
