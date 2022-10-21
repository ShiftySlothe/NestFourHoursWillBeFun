export class CreateJobPostDto {
  title: string;
  description: string;
  started: boolean;
  feeStructure: string;
  paid: boolean;
  paidAmount?: number;
  feePercentage?: number;
  feeAmmount?: number;
  settlementConstraints?: SettlementConstraints;
}

type SettlementConstraints = {
  min: number;
  max: number;
};
