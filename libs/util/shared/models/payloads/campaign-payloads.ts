export class CreateCampaignPayload {
  establishmentuuid: string;
  name: string;
  amount: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  rule: string;
  description: string;
  quantity: number;
  campaignId: string;
  accessToken: string;
  constructor(
    establishmentuuid: string,
    name: string,
    amount: number,
    imageUrl: string,
    startDate: string,
    endDate: string,
    rule: string,
    description: string,
    quantity: number,
    campaignId: string,
    accessToken: string
  ) {
    this.establishmentuuid = establishmentuuid;
    this.name = name;
    this.amount = amount;
    this.imageUrl = imageUrl;
    this.startDate = startDate;
    this.endDate = endDate;
    this.rule = rule;
    this.description = description;
    this.quantity = quantity;
    this.campaignId = campaignId;
    this.accessToken = accessToken;
  }
}
