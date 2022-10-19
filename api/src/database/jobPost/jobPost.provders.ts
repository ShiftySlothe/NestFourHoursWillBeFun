import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, JOBPOST_MODEL } from '../const';
import { JobPostSchema } from './jobPost.schema';

export const jobPostProviders = [
  {
    provide: JOBPOST_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('JobPost', JobPostSchema),
    inject: [DATABASE_CONNECTION],
  },
];
