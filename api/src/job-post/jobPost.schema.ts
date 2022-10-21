import * as mongoose from 'mongoose';

export interface JobPost {
  title: string;
  description: string;
  started: boolean;
  feeStructure: string;
  paid: boolean;
  paidAmount?: number;
  feePercentage?: number;
  feeAmmount?: number;
}

export const JobPostSchema = new mongoose.Schema<JobPost>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  started: { type: Boolean, required: true },
  feeStructure: { type: String, required: true },
  paid: { type: Boolean, required: true },
  paidAmount: { type: Number },
  feePercentage: { type: Number },
  feeAmmount: { type: Number },
});
