import { Inject, Injectable } from '@nestjs/common';
import { JOBPOST_MODEL } from 'src/database/const';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { Model } from 'mongoose';
import { JobPost } from 'src/job-post/jobPost.schema';

@Injectable()
export class JobPostService {
  constructor(
    @Inject(JOBPOST_MODEL)
    private jobPostModel: Model<JobPost>,
  ) {}

  create(createJobPostDto: CreateJobPostDto) {
    const jobPost = new this.jobPostModel(createJobPostDto);
    return jobPost.save();
  }

  findAll() {
    return this.jobPostModel.find().exec();
  }

  findOne(id: number) {
    return this.jobPostModel.findById(id).exec();
  }

  update(id: number, updateJobPostDto: UpdateJobPostDto) {
    return this.jobPostModel.findByIdAndUpdate(id, updateJobPostDto).exec();
  }

  remove(id: string) {
    console.log(id);
    return this.jobPostModel.findByIdAndDelete(id).exec();
  }
  // set paid
}
