import request = require("supertest");
import { paths } from "../globals/consts";
//  import { connect } from "../../../../libs/util/shared/db";
import { AddressPayload } from "./../../../../libs/util/shared/models/payloads/address-payloads";

export class AddressServices {
  environmentConfig;
  client;

  cepDatas: any;

  constructor(environmentConfig) {
    this.environmentConfig = environmentConfig;
  }

  async onServiceStart() {
    // const connection = await connect(this.environmentConfig.dbConnection);
    // this.client = connection;
  }

  async getCepDatas(payloadAddress: AddressPayload) {
    const res = await request(this.environmentConfig.baseUrl)
      .get(paths.ws + "/" + payloadAddress.zipCode + paths.json)
      .then((res) => {
        console.log("Cep Datas:", res.body);
        expect(res.statusCode).toBe(200);
        this.cepDatas = res.body;
        expect(typeof res.body.cep).toBe(typeof String());
        expect(res.body.cep).toBeTruthy();
      });
    return res;
  }
}
