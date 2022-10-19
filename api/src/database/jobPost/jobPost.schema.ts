import * as mongoose from 'mongoose';
import { JobPost } from 'src/job-post/entities/job-post.entity';

interface JobPost {
  title: string;
  description: string;
  started: Date;
}

export const JobPostSchema = new mongoose.Schema<JobPost>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  started: { type: Date, required: true },
});
