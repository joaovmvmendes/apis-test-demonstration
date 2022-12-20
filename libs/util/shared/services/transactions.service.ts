import { connect } from "../db";
import request = require("supertest");
import { paths } from "../globals/consts";
import {
  CreateSalePayload,
  SaleDatasPayload,
} from "../models/payloads/sales-payloads";
import { CreateCampaignPayload } from "../models/payloads/campaign-payloads";
import { HelpersServices } from "./helpers.service";

export enum Method {
  api,
  bd,
  both,
}

export class TransationsServices {
  environmentConfig;
  client;

  constructor(environmentConfig) {
    this.environmentConfig = environmentConfig;
  }
  async onServiceStart() {
    const connection = await connect(this.environmentConfig.dbConnection);
    this.client = connection;
  }

  async getSaleDatas(payloadGetSale: SaleDatasPayload) {
    const res = await request(this.environmentConfig.baseUrl)
      .get(paths.finance + paths.sale + "/" + payloadGetSale.uuid)
      .set("Authorization", `Bearer ${payloadGetSale.accessToken}`);
    console.log("Requested Sale datas:", res.body);
    return res;
  }
  async callSaleDatas(payloadGetSale: SaleDatasPayload) {
    const res = await this.client.query(`SELECT 
  Sales.cashback_rule_id, 
  Sales.cashback
  FROM demonstration_transactions.Sales
  WHERE
  Sales.uuid =  '${payloadGetSale.uuid}'`);
    console.log("Called Sale datas:", res.rows[0]);
    return res;
  }
  async createSaleOrder(payloadSale: CreateSalePayload) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.finance + paths.order)
      .send({
        total: payloadSale.total,
        methods: payloadSale.methods,
        phone: payloadSale.phone,
        disableNofication: true,
      })
      .set("Authorization", `Bearer ${payloadSale.accessToken}`);
    console.log("Created sale datas:", res.body);
    return res;
  }

  async createSale(payloadSale: CreateSalePayload) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.finance + paths.order + paths.requestForUser)
      .send({
        total: payloadSale.total,
        methods: payloadSale.methods,
        phone: payloadSale.phone,
        disableNofication: true,
      })
      .set("Authorization", `Bearer ${payloadSale.accessToken}`);
    console.log("Created sale datas:", res.body);
    await HelpersServices.setWait(15000);
    this.validaSale(res.body.transactionalUuid).then((res) => {
      expect(res.rows[0].status_uuid).toBe("OK");
      expect(res.rows[0].status_amount).toBe("OK");
      expect(res.rows[0].status_account).toBe("OK");

      expect(res.rows[1].status_uuid).toBe("OK");
      expect(res.rows[1].status_amount).toBe("OK");
      expect(res.rows[1].status_account).toBe("OK");

      expect(res.rows[2].status_uuid).toBe("OK");
      expect(res.rows[2].status_amount).toBe("OK");
      expect(res.rows[2].status_account).toBe("OK");

      expect(res.rows[3].status_uuid).toBe("OK");
      expect(res.rows[3].status_amount).toBe("OK");
      expect(res.rows[3].status_account).toBe("OK");

      expect(res.rows[4].status_uuid).toBe("OK");
      expect(res.rows[4].status_amount).toBe("OK");
      expect(res.rows[4].status_account).toBe("OK");

      expect(res.rows[5].status_uuid).toBe("OK");
      expect(res.rows[5].status_amount).toBe("OK");
      expect(res.rows[5].status_account).toBe("OK");

      expect(res.rows[6].status_uuid).toBe("OK");
      expect(res.rows[6].status_amount).toBe("OK");
      expect(res.rows[6].status_account).toBe("OK");

      expect(res.rows[7].status_uuid).toBe("OK");
      expect(res.rows[7].status_amount).toBe("OK");
      expect(res.rows[7].status_account).toBe("OK");

      expect(res.rows[8].status_uuid).toBe("OK");
      expect(res.rows[8].status_amount).toBe("OK");
      expect(res.rows[8].status_account).toBe("OK");
    });
    return res;
  }

  async getSale(method: Method, payloadGetSale: SaleDatasPayload) {
    await HelpersServices.setWait(10000);
    switch (method) {
      case Method.api:
        this.getSaleDatas(payloadGetSale).then((res) => {
          expect(res.body.status).toEqual("active");
        });
        break;
      case Method.bd:
        this.callSaleDatas(payloadGetSale);
        break;
      case Method.both:
        this.getSaleDatas(payloadGetSale);
        this.callSaleDatas(payloadGetSale);
        break;
      default:
        throw new Error(`Non-existent method in switch: ${method}`);
    }
  }

  async callSale(payloadGetSale: SaleDatasPayload) {
    const res = await this.client.query(`SELECT 
    Sales.cashback_rule_id, 
    Sales.cashback
  FROM demonstration_transactions.Sales
  WHERE
  Sales.uuid =  '${payloadGetSale.uuid}'`);
    console.log("Called Sale datas:", res);
    return res;
  }

  async createCampaign(payloadCampaign: CreateCampaignPayload) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.finance + paths.campaign)
      .send({
        name: payloadCampaign.name,
        amount: payloadCampaign.amount,
        imageUrl: payloadCampaign.imageUrl,
        startDate: payloadCampaign.startDate,
        endDate: payloadCampaign.endDate,
        rule: payloadCampaign.rule,
        description: payloadCampaign.description,
        quantity: payloadCampaign.quantity,
        campaignId: payloadCampaign.campaignId,
      })
      .set("Authorization", `Bearer ${payloadCampaign.accessToken}`);
    console.log("Created Campaign datas:", res.body);
    return res;
  }

  async validaVale(campaignUuid: string) {
    const res = await this.client
      .query(`SELECT x.* FROM demonstration_transactions.vouchers x
    WHERE campaign_uuid =  '${campaignUuid}'`);
    console.log("uuid vale desconto:", res.rows[0].uuid);
    return res;
  }

  async validaSale(saleUuid: string) {
    const res = await this.client.query(`
      select 
        processed_split.slice,
        processed_split.uuid_transaction,
        processed_split.percent_value,
        processed_split.uuid as expect_uuid,
        processed_split.old_uuid as registred_uuid,
        processed_split.account_name as expect_account_name,
        processed_split.old_account_name as registred_account_name,
        processed_split.amount as expect_amount,
        processed_split.old_amount as registred_amount,
        case 
          when (processed_split.uuid = processed_split.old_uuid) then
            'OK'
          else 
            'Error'
        end status_uuid,
        case 
          when (processed_split.amount = processed_split.old_amount) then
            'OK'
          else 
            'Error'
        end status_amount,
        case 
          when (processed_split.account_name = processed_split.old_account_name) then
            'OK'
          else 
            'Error'
        end status_account
      from (
          select
            transaction_old.uuid as uuid_transaction,
            base_split.slice,	
            base_split.percent_value,
            splits.uuid,
            transaction_old.entity_uuid as old_uuid,
            splits.account_name,	
            transaction_old.account_name as old_account_name,
            case 
              when (trunc((coalesce(sales.cashback,0) * base_split.percent_value-trunc(coalesce(sales.cashback,0) * base_split.percent_value,2))*1000) < 5) then
                trunc(coalesce(sales.cashback,0) * base_split.percent_value,2)
              when (trunc((coalesce(sales.cashback,0) * base_split.percent_value-trunc(coalesce(sales.cashback,0) * base_split.percent_value,2))*1000) > 5) then
                trunc(coalesce(sales.cashback,0) * base_split.percent_value,2) + 0.01
              when (
                  (trunc((coalesce(sales.cashback,0) * base_split.percent_value-trunc(coalesce(sales.cashback,0) * base_split.percent_value,2))*1000) = 5) 
                  and (trunc((coalesce(sales.cashback,0) * base_split.percent_value-trunc(coalesce(sales.cashback,0) * base_split.percent_value,3))*10000) > 0)
                 ) then
                trunc(coalesce(sales.cashback,0) * base_split.percent_value,2) + 0.01
              when (
                  (trunc((coalesce(sales.cashback,0) * base_split.percent_value-trunc(coalesce(sales.cashback,0) * base_split.percent_value,2))*1000) = 5) 
                  and (mod(trunc((coalesce(sales.cashback,0) * base_split.percent_value-trunc(coalesce(sales.cashback,0) * base_split.percent_value,1))*100),2) = 1)
                 ) then
                trunc(coalesce(sales.cashback,0) * base_split.percent_value,2) + 0.01
              else 
                trunc(coalesce(sales.cashback,0) * base_split.percent_value,2)
            end amount,
            transaction_old.amount as old_amount,
            case 
              when (splits.uuid = transaction_old.entity_uuid) then
                'OK'
              else 
                'Error'
            end status_uuid,
            case 
              when ((coalesce(sales.cashback,0) * splits.percent_value) = transaction_old.amount) then
                'OK'
              else 
                'Error'
            end status_amount,
            case 
              when (splits.account_name = transaction_old.account_name) then
                'OK'
              else 
                'Error'
            end status_account	
          from (
              --social
              select
                'social' as slice,
                0.06 as percent_value
              union all
              --customer
              select 
                'customer' as slice,
                0.3 as percent_value
              union all
              --operator
              select 
                'operator' as slice,
                0.05 as percent_value
              union all	
              --intermediary
              select 
                'intermediary' as slice,
                0.25 as percent_value
              union all
              --voucher
              select 
                'voucher' as slice,
                0.15 as percent_value
              union all				
              --referral	
              select 
                'referral' as slice,
                0.1 as percent_value
              union all				
              --lisenced
              select
                'licensed' as slice,
                0.05 as percent_value
              union all	
              --company_referral
              select
                'company_referral' as slice,
                0.01 as percent_value
              union all	
              --lisenced_master
              select
                'licensed_master' as slice,
                0.03 as percent_value
            ) as base_split
          left join ( 			
                --social
                select
                  replace(cast (system_parameters."object"->'social'->'entity_uuid' as text), '"', '') as uuid,
                  'social' as slice,
                  'cash_back' as account_name,
                  0.06 as percent_value
                from demonstration_entities.system_parameters	
                where 
                  system_parameters."type" = 'cashback_rules_defaults'
                  and system_parameters.status = 'active'
                union all
                --customer
                select 
                  s.entity_buyer_uuid as uuid,
                  'customer' as slice,
                  'cash_back' as account_name,
                  0.3 as percent_value
                from demonstration_transactions.sales s 
                where 
                  s.uuid = '${saleUuid}'
                union all
                --operator
                select 
                  operator.uuid,
                  'operator' as slice,
                  'cash_back' as account_name,
                  0.05 as percent_value
                from ( 
                    select 
                      case 
                        when (users.entity_uuid is not null) then 
                          users.entity_uuid
                        else
                          s.entity_operator_uuid
                      end as uuid
                    from demonstration_transactions.sales s 
                    inner join demonstration_entities.profiles p 
                      on (s.entity_operator_uuid = p.entity_uuid)
                    left join (
                          select
                            p2.entity_uuid,
                            p2.phone
                          from demonstration_entities.profiles p2
                          inner join demonstration_entities.entities e 
                            on (
                                (p2.entity_uuid = e.uuid)
                                and (e."type" = 'user')
                              )
                      ) as users
                      on (substring(p.phone, char_length(p.phone) - 7, 8) = substring(users.phone, char_length(users.phone) - 7, 8))
                    where 
                      s.uuid = '${saleUuid}'
                    limit 1
                ) as operator								
                union all	
                --intermediary
                select 
                  case
                    when (sale.new_user = 1) then
                      sale.uuid
                    else
                      uuid_default.uuid
                  end as uuid,
                  'intermediary' as slice,
                  'cash_back' as account_name,
                  0.25 as percent_value
                from (
                    select 
                      case 
                        when (users.entity_uuid is not null) then 
                          users.entity_uuid
                        else
                          s.entity_operator_uuid
                      end as uuid,
                      s.new_user 
                    from demonstration_transactions.sales s 
                    inner join demonstration_entities.profiles p 
                      on (s.entity_operator_uuid = p.entity_uuid)
                    left join (
                          select
                            p2.entity_uuid,
                            p2.phone
                          from demonstration_entities.profiles p2
                          inner join demonstration_entities.entities e 
                            on (
                                (p2.entity_uuid = e.uuid)
                                and (e."type" = 'user')
                              )
                      ) as users
                      on (substring(p.phone, char_length(p.phone) - 7, 8) = substring(users.phone, char_length(users.phone) - 7, 8))
                    where 
                      s.uuid = '${saleUuid}'
                    limit 1
                  ) as sale
                left join (
                      select 
                        replace(cast (system_parameters."object"->'intermediary'->'entity_uuid' as text), '"', '') as uuid
                      from demonstration_entities.system_parameters
                      where 
                        system_parameters."type" = 'cashback_rules_defaults'
                        and system_parameters.status = 'active'
                  ) as uuid_default
                  on (1=1)
                union all
                --voucher
                select 
                  s.entity_seller_uuid as uuid,
                  'voucher' as slice,
                  'cash_back_vouchers' as account_name,
                  0.15 as percent_value
                from demonstration_transactions.sales s 
                where 
                  s.uuid = '${saleUuid}'
                union all				
                --referral	
                select 
                  case 
                    when (referral_sale.uuid is not null) then
                      referral_sale.uuid
                    else
                      referral_default.uuid		
                  end as uuid,
                  'referral' as slice,
                  case 
                    when (referral_sale."type" = 'company') then
                      'cash_back_vouchers'
                    else 
                      'cash_back'
                  end as account_name,
                  0.1 as percent_value
                from (
                    select 
                      replace(cast (system_parameters."object"->'intermediary'->'entity_uuid' as text), '"', '') as uuid
                    from demonstration_entities.system_parameters
                    where 
                      system_parameters."type" = 'cashback_rules_defaults'
                      and system_parameters.status = 'active'
                  ) as referral_default
                left join (	
                      select 
                        ee.entity_parent_uuid as uuid,
                        e."type" 
                      from demonstration_transactions.sales s 
                      inner join demonstration_entities.entity_entity ee 
                        on (
                            (s.entity_buyer_uuid = ee.entity_child_uuid)	
                            and (ee."type" = 'referral')
                        )	
                      inner join demonstration_entities.entities e 
                        on (ee.entity_parent_uuid = e.uuid)	
                      where 
                        s.uuid = '${saleUuid}'
                  ) as referral_sale
                  on (1=1)
                union all				
                --lisenced
                select
                  replace(cast (system_parameters."object"->'intermediary'->'entity_uuid' as text), '"', '') as uuid,
                  'licensed' as slice,
                  'cash_back' as account_name,
                  0.05 as percent_value
                from demonstration_entities.system_parameters
                where 
                  system_parameters."type" = 'cashback_rules_defaults'
                  and system_parameters.status = 'active'
                union all	
                --company_referral
                select
                  replace(cast (system_parameters."object"->'intermediary'->'entity_uuid' as text), '"', '') as uuid,
                  'company_referral' as slice,
                  'cash_back' as account_name,
                  0.01 as percent_value
                from demonstration_entities.system_parameters
                where 
                  system_parameters."type" = 'cashback_rules_defaults'
                  and system_parameters.status = 'active'
                union all	
                --lisenced_master
                select
                  replace(cast (system_parameters."object"->'intermediary'->'entity_uuid' as text), '"', '') as uuid,
                  'licensed_master' as slice,
                  'cash_back' as account_name,
                  0.03 as percent_value
                from demonstration_entities.system_parameters
                where 
                  system_parameters."type" = 'cashback_rules_defaults'
                  and system_parameters.status = 'active'
            ) as splits
            on (base_split.slice = splits.slice)
          left join demonstration_transactions.sales as sales 
            on (sales.uuid = '${saleUuid}')
          left join (
                select 
                  t.uuid,
                  cast(t.account_name as text) as account_name,
                  t.entity_uuid, 
                  t.amount,
                  cast(t.slice as text) as slice
                from demonstration_transactions.transactions t 
                where 
                  t.slice is not null
                  and t.source_id = '${saleUuid}'
                  and t.source_type = 'sales'
          ) as transaction_old
            on (splits.slice = transaction_old.slice) 	
      ) as processed_split`);
    console.log("Res:", res.rows);
    return res;
  }

  async createPix(amount: number, token: string) {
    //TODO: Automatizar retorno para receber o id
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.finance + paths.bankTransfers + paths.pixCharge)
      .send({
        key: "4bbc43fc-7281-4fc3-8bed-fcf53c0bd645",
        amount: 20.6,
        additionalData: {
          name: "Teste",
          value: 10,
        },
      })
      .set("Authorization", `Bearer ${token}`);
    console.log("Created PIX datas:", res.body);
    return res;
  }

  async pixPay(id: string) {
    //TODO: Receber o id automatizado
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.finance + paths.juno + paths.webhook)
      .send({
        eventId: "94895690-86ea-41e5-a713-7f0f35d8ccb0",
        eventType: "PAYMENT_NOTIFICATION",
        timestamp: "2022-06-07T15:32:53.735-03:00",
        data: [
          {
            entityId: "pay_528C18EDCEB2AED2F677FB9FCB390C6C",
            entityType: "PAYMENT",
            attributes: {
              createdOn: "2022-06-07 15:32:53",
              date: "2022-06-07 15:32:53",
              releaseDate: "2022-06-07 00:00:00",
              amount: 20.6,
              fee: 0.6,
              status: "CONFIRMED",
              type: "PIX_DYNAMIC_QRCODE",
              charge: {
                id: "chr_717FB03A8AABADB3661B3A9C469C3C69",
                code: "350303494",
                amount: 20.6,
                status: "PAID",
                dueDate: "2022-06-08 00:00:00",
                payer: {
                  name: "Exemplo de Nome",
                  document: "82515379000137",
                  address: {
                    street: null,
                    number: null,
                    complement: null,
                    city: null,
                    state: null,
                    postCode: null,
                    neighborhood: null,
                  },
                  id: null,
                },
              },
              pix: {
                txid: id,
                endToEndId: "E18236120202206071832s00eb6bd561",
              },
              digitalAccountId: "dac_7C02F04F56994272B3EEAAC62C49761E",
            },
          },
        ],
      });
    console.log("Payment pix response:", res.body);
    return res;
  }
}
