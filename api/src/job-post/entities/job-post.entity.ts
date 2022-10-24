import { SettlementConstraints } from '../dto/create-job-post.dto';

export class JobPost {
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
