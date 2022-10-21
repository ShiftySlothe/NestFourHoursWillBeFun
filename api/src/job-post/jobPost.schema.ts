import * as mongoose from 'mongoose';

export interface JobPost {
  title: string;
  description: string;
  started: boolean;
  feeStructure: string;
  feePercentage?: number;
  feeAmmount?: number;
}

export const JobPostSchema = new mongoose.Schema<JobPost>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  started: { type: Boolean, required: true },
  feeStructure: { type: String, required: true },
  feePercentage: { type: Number },
  feeAmmount: { type: Number },
});
