export class BalancePayload {
  typeAccount: string;
  entityUuid: string;
  valor: number;
  constructor(typeAccount: string, entityUuid: string, valor: number) {
    this.typeAccount = typeAccount;
    this.entityUuid = entityUuid;
    this.valor = valor;
  }
}
