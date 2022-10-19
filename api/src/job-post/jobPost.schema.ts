import * as mongoose from 'mongoose';

export interface JobPost {
  title: string;
  description: string;
  started: Date;
}

export const JobPostSchema = new mongoose.Schema<JobPost>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  started: { type: Date, required: true },
});
