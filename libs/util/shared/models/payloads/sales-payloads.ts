export class CreateSalePayload {
  total: number;
  methods: {};
  phone: string;
  accessToken: string;
  requestUuid: string;
  constructor(
    total: number,
    methods: {},
    phone: string,
    accessToken: string,
    requestUuid: string
  ) {
    this.total = total;
    this.methods = methods;
    this.phone = phone;
    this.accessToken = accessToken;
    this.requestUuid = requestUuid;
  }
}

export class SaleDatasPayload {
  uuid: string;
  accessToken: string;
  constructor(uuid: string, accessToken: string) {
    this.uuid = uuid;
    this.accessToken = accessToken;
  }
}
