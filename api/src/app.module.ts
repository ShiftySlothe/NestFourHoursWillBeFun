import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobPostModule } from './job-post/job-post.module';

@Module({
  imports: [JobPostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
