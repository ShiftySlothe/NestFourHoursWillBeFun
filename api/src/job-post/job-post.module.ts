import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { DatabaseModule } from 'src/database/database.module';
import { jobPostProviders } from './jobPost.provders';

@Module({
  imports: [DatabaseModule],
  controllers: [JobPostController],
  providers: [JobPostService, ...jobPostProviders],
})
export class JobPostModule {}
