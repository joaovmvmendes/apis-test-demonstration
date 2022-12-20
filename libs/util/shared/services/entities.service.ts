import request = require("supertest");
import { paths } from "../globals/consts";
import { connect } from "../../../../libs/util/shared/db";
import {
  CreateEstablishmentInterface,
  CreateOperatorInterface,
} from "./../../../../libs/util/shared/models/interfaces/entities-interface";
import {
  LoginPayload,
  EntityPayload,
  ChangePasswordPayload,
  AcceptTermsPayload,
  QueryOperatorPayload,
  AdminPayload,
  /* AdminPass, */
} from "../../../../libs/util/shared/models/payloads/entities-payloads";
import { HelpersServices } from "./helpers.service";

export class EntityServices {
  environmentConfig;
  client;

  constructor(environmentConfig) {
    this.environmentConfig = environmentConfig;
  }

  async onServiceStart() {
    const connection = await connect(this.environmentConfig.dbConnection);
    this.client = connection;
  }

  async getAdminUser(payloadAdmin: AdminPayload) {
    const res = await this.client.query(`SELECT 
    e.uuid,
    e."type",
    c."user",
    c.hash
  from demonstration_entities.credentials c
  inner join demonstration_entities.entities e 
    on (
        (c.entity_uuid = e.uuid)
        and (e."type" = '${payloadAdmin.user}'))`);
    console.log("Admin User: ", res.rows);
    return res;
  }

  async login(payloadAdmin: LoginPayload) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.auth + paths.login)
      .send({
        username: payloadAdmin.login,
        password: payloadAdmin.pass,
      });
    console.log("Login Response:", res.body);
    return res;
  }

  async callEntity(payloadEntity: EntityPayload) {
    HelpersServices.setWait(10000);
    const res = await this.client.query(`SELECT
      *
    FROM demonstration_entities.entities e
    WHERE e.uuid = '${payloadEntity.uuid}' `);
    console.log("Entity Datas:", res.rows[0]);
    return res;
  }

  async createEstablishment(payloadEntity: CreateEstablishmentInterface) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.establishment + paths.v1 + paths.establishments)
      .send({
        socialReason: payloadEntity.socialReason,
        name: payloadEntity.name,
        responsible: payloadEntity.responsible,
        logo: payloadEntity.logo,
        headerImg: payloadEntity.headerImg,
        legalId: payloadEntity.legalId,
        category: payloadEntity.category,
        subcategory: payloadEntity.subcategory,
        licensedUuid: payloadEntity.licensedUuid,
        referral: payloadEntity.referral,
        commission: payloadEntity.commission,
        description: payloadEntity.description,
        phone: payloadEntity.phone,
        secondPhone: payloadEntity.secondPhone,
        whatsapp: payloadEntity.whatsapp,
        email: payloadEntity.email,
        status: payloadEntity.status,
        cep: payloadEntity.cep,
        neighborhood: payloadEntity.neighborhood ?? "neighborhood",
        city: payloadEntity.city ?? "city",
        state: payloadEntity.state ?? "state",
        street: payloadEntity.street ?? "street",
        number: payloadEntity.number ?? "number",
        country: payloadEntity.country ?? "contry",
        complement: payloadEntity.complement ?? "complement",
        lat: payloadEntity.lat ?? "0",
        lng: payloadEntity.lng ?? "0",
        rating: payloadEntity.rating,
      })
      .set("Authorization", `Bearer ${payloadEntity.accessToken}`);
    console.log("Establishment Created:", res.body);
    return res;
  }

  async createOperator(payloadEntity: CreateOperatorInterface) {
    const res = await request(this.environmentConfig.baseUrl)
      .post(paths.users + paths.operator)
      .send({
        name: payloadEntity.name,
        legalId: payloadEntity.legalId,
        email: payloadEntity.email,
        phone: payloadEntity.phone,
      })
      .set("Authorization", `Bearer ${payloadEntity.accessToken}`);
    console.log("Operator Created:", res.body);
    return res;
  }

  async loginEstablishment(payloadEstablishment: LoginPayload) {
    const res = await request(this.environmentConfig.legacyUrl)
      .post(paths.v1 + paths.companies + paths.login)
      .send({
        user: payloadEstablishment.login,
        password: payloadEstablishment.pass,
      });
    console.log("Login Response:", res.body);
    return res;
  }

  async loginOperator(payloadAdmin: LoginPayload) {
    const res = await request(this.environmentConfig.legacyUrl)
      .post(paths.v1 + paths.operators + paths.login)
      .send({
        user: payloadAdmin.login,
        password: payloadAdmin.pass,
      });
    console.log("Login Response:", res.body);
    return res;
  }

  async changePassword(payloadEntity: ChangePasswordPayload) {
    const res = await request(this.environmentConfig.legacyUrl)
      .patch(
        paths.v1 +
          paths.operators +
          "/" +
          payloadEntity.entityUuid +
          paths.changePass
      )
      .send({
        entityUuid: payloadEntity.entityUuid,
        newPassword: payloadEntity.newPassword,
        oldPassword: payloadEntity.oldPassword,
      })
      .set("Authorization", `Bearer ${payloadEntity.accessToken}`);
    console.log("Change Password Response:", res.body);
    return res;
  }

  async acceptTerms(payloadEntity: AcceptTermsPayload) {
    const res = await request(this.environmentConfig.legacyUrl)
      .put(
        paths.v1 +
          paths.users +
          "/" +
          payloadEntity.entityUuid +
          paths.acceptTerms
      )
      .send({
        version: payloadEntity.version,
      })
      .set("Authorization", `Bearer ${payloadEntity.accessToken}`);
    console.log("Accept Terms Response:", res.body);
    return res;
  }

  async queryOperator(payloadEntity: QueryOperatorPayload) {
    HelpersServices.setWait(10000);
    const res = await this.client.query(`SELECT
    Profiles.entity_uuid,
    Profiles.name,
    Profiles.phone,
    Entities.status
    FROM demonstration_entities.Profiles
    INNER JOIN demonstration_entities.Entities
    ON (Profiles.entity_uuid = Entities.uuid)
    INNER JOIN demonstration_entities.Entity_Entity
    ON (Profiles.entity_uuid = Entity_Entity.entity_child_uuid)
    WHERE
    Profiles.entity_uuid = '${payloadEntity.operatorUuid}'
    AND Entity_Entity.entity_parent_uuid = '${payloadEntity.establishmentUuid}'`);
    console.log("Entity Datas:", res.rows[0]);
    return res;
  }

  async getOperator(payloadEntity: QueryOperatorPayload) {
    const res = await request(this.environmentConfig.baseUrl).get(
      paths.users +
        paths.instances +
        paths.operator +
        paths.active +
        "?establishmentUuid=" +
        payloadEntity.establishmentUuid +
        "&operatorUuid=" +
        payloadEntity.operatorUuid
    );
    console.log("Operator valid datas:", res.body);
    return res;
  }

  async getEstablishment(establishmentUuid: string) {
    const res = await request(this.environmentConfig.baseUrl).get(
      paths.users +
        paths.instances +
        paths.establishment +
        "/" +
        establishmentUuid
    );
    console.log("Entity valid datas:", res.body);
    return res;
  }

  async callEntityByPhone(phone: string, typeAccount: string) {
    //TODO: Comentary: build a comentary with all of the acconut types
    const res = await this.client.query(`SELECT
    profiles.entity_uuid 
    from demonstration_entities.profiles
    inner join demonstration_entities.entities 
    on (
        (profiles.entity_uuid = entities.uuid)
        and (entities."type" = '${typeAccount}')
      )
  where 
    profiles.phone like  '%${phone}%'`);
    console.log("Entity uuid by phone:", res.rows[0].entity_uuid);
    return res;
  }

  async setEntityPassword(entityPassword: string, entityUuid: string) {
    //TODO: Comentary: build a comentary with all of the acconut types
    const res = await this.client.query(`
        update demonstration_entities.credentials 
        set hash = encode(sha256(CONCAT('${entityPassword}','MrLKYxxHef4TnZGBaKk6mYgPEBsR9MxLnnMxnah9')::bytea), 'hex')
        where entity_uuid = '${entityUuid}'`);
    console.log("Set password response:", res.command);
    return res;
  }
  async loginUser(payloadAdmin: LoginPayload) {
    const res = await request(this.environmentConfig.legacyUrl)
      .post(paths.v1 + paths.users + paths.login)
      .send({
        user: payloadAdmin.login,
        password: payloadAdmin.pass,
      });
    console.log("Login Response:", res.body);
    return res;
  }
  async setEntityCategory() {
    const res = await this.client.query(`select
        res.categoria,
        res.subcategoria
      from (
          SELECT 
            json_data.key as categoria,
            json_data.value,
            json_array_elements(json_data.value::json)::json->>'value' as subcategoria
          FROM demonstration_entities.system_parameters, 
            json_each_text(system_parameters."object") AS json_data
          where
            "type" = 'company_sub_categories'
            and json_data.key = (
                        select
                          categories.category
                        from (
                            SELECT json_array_elements(sp."object") ::json->>'value' as category
                            FROM demonstration_entities.system_parameters sp
                            where
                              sp."type" = 'company_categories'
                          ) as categories
                        order by random()
                        limit 1
                      )
        ) as res
      order by random()
      limit 1`);
    console.log(res.rows[0]);
    return res;
  }

  async getDefaultComission() {
    const res = await this.client.query(`select
    replace(cast (sp."object"->'commission'as text), '"', '') as defaultCommission
  from
    demonstration_entities.system_parameters sp
  where
    sp."type" = 'standard_values'
    and sp.status = 'active'`);
    return res;
  }

  async getEstablishmentComission(entityUuid) {
    const res = await this.client.query(
      `select cp.commission as comission from demonstration_entities.company_profiles cp where cp.entity_uuid = '${entityUuid}'`
    );
    return res;
  }
}
