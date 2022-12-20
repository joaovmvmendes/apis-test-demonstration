import { calculaTimeOut, timeOuts } from "../libs/util/shared/globals/timeOut";
import { getEnvironment } from "../libs/util/shared/globals/environments/index";
import { EntityServices } from "../libs/util/shared/services/entities.service";
import { AddressServices } from "../libs/util/shared/services/address.service";
import { BalanceServices } from "../libs/util/shared/services/balance.service";
import { TransationsServices } from "../libs/util/shared/services/transactions.service";

let entityService: EntityServices;
let balanceService: BalanceServices;
let transactionsService: TransationsServices;
let addressServices: AddressServices;

const environment = getEnvironment();

beforeAll(async () => {
  entityService = new EntityServices(environment);
  await entityService.onServiceStart();

  balanceService = new BalanceServices(environment);
  await balanceService.onServiceStart();

  transactionsService = new TransationsServices(environment);
  await transactionsService.onServiceStart();

  addressServices = new AddressServices(environment);
  await addressServices.onServiceStart();
  return;
}, timeOuts.connection);

describe("Establishment Step", () => {
  it(
    "Query to get admin acess",
    async () => {
      const adminPayload = new AdminPayload("admin");
      await entityService.getAdminUser(adminPayload).then((res) => {
        rowVars = res.rows;
        adminUser = randList(rowVars);
        adminUuid = adminUser.uuid;
        adminLoginUser = adminUser.user;
      });
    },
    timeOuts.db
  );
});
