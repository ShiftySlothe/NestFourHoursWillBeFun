import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateJobPostDto } from './create-job-post.dto';

export class UpdateJobPostDto extends PartialType(CreateJobPostDto) {}

export class SetPaidJonPostDto {
  feeAmmount: number;
}
