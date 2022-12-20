import request = require("supertest");
import { paths } from "../globals/consts";
//  import { connect } from "../../../../libs/util/shared/db";
import { AddressPayload } from "./../../../../libs/util/shared/models/payloads/address-payloads";

export class AddressServices {
  environmentConfig;
  client;

  constructor(environmentConfig) {
    this.environmentConfig = environmentConfig;
  }

  async onServiceStart() {
    // const connection = await connect(this.environmentConfig.dbConnection);
    // this.client = connection;
  }

  async getCepDatas(payloadAddress: AddressPayload) {
    // TODO: Create: function to call the service again if any returned field is null
    const res = await request(this.environmentConfig.baseUrl).get(
      paths.ws +
      "/" +
        payloadAddress.zipCode +
        paths.json
    );
    console.log("Cep Datas:", res.body);
    return res;
  }
}
