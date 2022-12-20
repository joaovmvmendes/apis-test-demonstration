import request = require("supertest");
import { connect } from "../../../../libs/util/shared/db";
import { BalancePayload } from "./../models/payloads/balance-payloads";
import { paths } from "../globals/consts";
import { HelpersServices } from "./helpers.service";

export class BalanceServices {
  environmentConfig;
  client;

  constructor(environmentConfig) {
    this.environmentConfig = environmentConfig;
  }

  async onServiceStart() {
    const connection = await connect(this.environmentConfig.dbConnection);
    this.client = connection;
  }

  async insertCashback(balancePayload: BalancePayload) {
    // typeAccount must be cash_back or cash_back_vouchers
    const res = await this.client.query(`INSERT INTO
    demonstration_transactions.transactions
    (uuid, account_name, entity_uuid, operation_type, source_type, source_id, pair_type, pair_id,
    amount, created_at, updated_at, slice, bail)
    VALUES(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),
    '${balancePayload.typeAccount}', '${balancePayload.entityUuid}', 'credit', 'sales',
    '15e99aad-48a8-44db-8787-14ccb956addd', 'debit', 'ae17e695-5d54-43bc-a5a3-0aa31951f02d',
    '${balancePayload.valor}', current_timestamp, NULL, 'voucher', NULL); `);
    return res;
  }

  // account_name (cash_back & cash_back_vouchers)
  async getBalance(entityUuid: string) {
    const res = await this.client.query(`select
    sum(vcb.balance_with_pending) as balance_with_pending,
    sum(vcb.credit_with_pending) as credit_with_pending,
    sum(vcb.debit_with_pending) as debit_with_pending,
    sum(vcb.balance_without_pending) as balance_without_pending,
    sum(vcb.credit_without_pending) as credit_without_pending,
    sum(vcb.debit_without_pending) as debit_without_pending,
    sum(vcb.balance_pending) as balance_pending,
    sum(vcb.credit_pending) as credit_pending,
    sum(vcb.debit_pending) as debit_pending 
  from 
    demonstration_transactions.vw_company_balance vcb 
  where 
    vcb.entity_uuid = '${entityUuid}'`);
    console.log("Balances: ", res.rows[0]);
    return res;
  }

  async getCahsbackBuyer(phone: string) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.finance + paths.order + paths.cashback)
      .send({
        phone: phone,
      });
    console.log("CashBack Validation:", res.body);
    return res;
  }

  async transfersValidate(id: string) {
    const res = await this.client.query(
      `select * from demonstration_transactions.charges tc where tc.transaction_id = '${id}'`
    );
    console.log("Transfer Datas: ", res.rows);
    return res;
  }

  async balancePaymentPixValidate() {
    await HelpersServices.setWait(10000);
    const res = await this.client.query(
      `select * from demonstration_transactions.transactions where source_type = 'pix' order by created_at desc limit 3 `
    );
    console.log("Payment Datas: ", res.rows);
    return res;
  }

  async balanceApi(accesToken: string) {
    const res = await request(this.environmentConfig.legacyUrl)
      .get(paths.v1 + paths.users + paths.me)
      .set("Authorization", `Bearer ${accesToken}`);
    console.log("Balances: ", res.body);
    return res;
  }

  async balanceComposition(
    randomUuid: string,
    entityUuid: string,
    typeTransaction: string,
    pairType: string,
    amount: number
  ) {
    const res = await this.client.query(
      `INSERT into
      demonstration_transactions.Transactions (
          uuid,
          account_name ,
          entity_uuid ,
          operation_type ,
          source_type ,
          source_id ,
          pair_type ,
          pair_id ,
          amount,
          slice,
          bail)
      Values ('${randomUuid}', -- uuid-random
          'cash_back', -- account_name
          '${entityUuid}', --entity_uuid
          '${typeTransaction}', -- operation_type
          'sales', --source_type
          '110214111-d7d1-4826-bf8a-9cde2702422', -- source_id
          '${pairType}', --pair_type
          '26bdd009-cb4f-4b2e-af8b-d08e55428888', --pair_id
          '${amount}', --amount
          'change', --slice
          current_timestamp); --bail`
    );
    console.log("Balance Copmposition: ", res.rows);
    return res;
  }

  async clearBalance(entityUuid: string) {
    const res = await this.client.query(
      `delete 
      from 
        demonstration_transactions.transactions t 
      where 
        t.entity_uuid = '${entityUuid}'
      and 
        t.operation_type = 'credit' 
          or t.operation_type = 'debit'`
    );
    console.log("Delete Confirmation: ", res.rows);
    return res;
  }

  async saleCashback(saleUuid: string) {
    await HelpersServices.setWait(15000);
    const res = await this.client.query(
      `select s.cashback as cashback from demonstration_transactions.sales s where s.uuid = '${saleUuid}'`
    );
    console.log("Cashback Venda: ", res.rows);
    return res;
  }

  async validateBail(saleUuid: string) {
    const res = await this.client.query(
      `select 
      --t.*
      count(t.uuid) as qtdbail
    from demonstration_transactions.transactions t 
    inner join ( 
            -- Consulta de vales dinheiro utilizado em uma venda
            select
              v.uuid
            from demonstration_transactions.sales s 
            inner join demonstration_transactions.used_vouchers_sales uvs 
              on 	(
                  (s.uuid = uvs.sale_uuid)
                )
            inner join demonstration_transactions.vouchers v 
              on 	(
                  (uvs.voucher_uuid = v.uuid)
                  and (v."type" = 'ordinary')
                )
            where 
              s.uuid = '${saleUuid}'
            union all					
            -- Consulta da venda
            select
              s.uuid 
            from demonstration_transactions.sales s 
            where 
              s.uuid = '${saleUuid}'
      ) as data_sale_and_voucher
      on 	(
          (t.source_id = data_sale_and_voucher.uuid)
        )
        where t.bail is null `
    );
    console.log("Bail: ", res.rows);
    return res;
  }
}
