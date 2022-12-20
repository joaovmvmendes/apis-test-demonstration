import { calculaTimeOut, timeOuts } from "../libs/util/shared/globals/timeOut";
import { getEnvironment } from "../libs/util/shared/globals/environments/index";
import { AddressServices } from "../libs/util/shared/services/address.service";
import { AddressPayload } from "../libs/util/shared/models/payloads/address-payloads";
import * as func from '../libs/util/shared/functions/field-functions';

let addressServices: AddressServices;

const environment = getEnvironment();

beforeAll(async () => {
  addressServices = new AddressServices(environment);
  await addressServices.onServiceStart();

  return;
}, timeOuts.connection);

let zipCode = func.cep_fields();

describe("Demonstration", () => {

  it(
    "Demonstration of how to use the service",
    async () => {
      const addressPayload = new AddressPayload(zipCode);
      await addressServices.getCepDatas(addressPayload).then((res) => {
        expect(res.statusCode).toBe(200);
      });
    },
    calculaTimeOut(timeOuts.connection, 5000)
  );
});
