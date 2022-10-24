import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { SetPaidJonPostDto, UpdateJobPostDto } from './dto/update-job-post.dto';
import { JobPost } from './job-post.entity';

const standardErrRes =
  'Unable to create job post as form data invalid, please try again.';
@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  create(@Body() createJobPostDto: CreateJobPostDto) {
    console.log('POSTED');
    this.handleCreateErrors(createJobPostDto);
    console.log('PASSED');
    return this.jobPostService.create(createJobPostDto);
  }

  private handleCreateErrors(createJobPostDto: CreateJobPostDto) {
    if (!createJobPostDto.title) {
      console.log('Unable to create job post as title not found');
      throw new HttpException(standardErrRes, HttpStatus.BAD_REQUEST);
    }
    if (!createJobPostDto.description) {
      console.log('Unable to create job post as no description found.');
      throw new HttpException(standardErrRes, HttpStatus.BAD_REQUEST);
    }
    if (!createJobPostDto.started) {
      console.log('Unable to create post as no started found.');
      throw new HttpException(standardErrRes, HttpStatus.BAD_REQUEST);
    }
    if (createJobPostDto.paid === undefined) {
      console.log('Unable to create post as no paid found.');
      throw new HttpException(standardErrRes, HttpStatus.BAD_REQUEST);
    }

    if (
      createJobPostDto.feeStructure !== 'noWinNoFee' &&
      createJobPostDto.feeStructure !== 'fixedFee'
    ) {
      throw new HttpException(
        "Fee structure must be 'No Win No Fee' or 'Fixed Fee'",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      createJobPostDto.feeStructure === 'fixedFee' &&
      !createJobPostDto.feeAmmount
    ) {
      console.log('Unable to create post as no feeAmmount found.');
      throw new HttpException(
        'Fee ammount must be provided if fee structure is Fixed Fee',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      createJobPostDto.feeStructure === 'noWinNoFee' &&
      (!createJobPostDto.feePercentage ||
        !createJobPostDto.settlementConstraints.min ||
        !createJobPostDto.settlementConstraints.max)
    ) {
      console.log(
        'Unable to create post as feePercentage or settle constraints not found.',
      );
      throw new HttpException(
        'Fee percentage and settlement constraints must not be provided if feeStructure is No Win No Fee',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      createJobPostDto.feePercentage > 1 ||
      createJobPostDto.feePercentage < 0.01
    ) {
      console.log(
        'Fee percentage range incorrect ',
        createJobPostDto.feePercentage,
      );
      throw new HttpException(
        'Fee percentage must be between 100 and 1',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll() {
    return this.jobPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostDto: UpdateJobPostDto) {
    return this.jobPostService.update(id, updateJobPostDto);
  }

  @Patch('set-paid/:id')
  async setPaid(
    @Param('id') id: string,
    @Body() updateJobPostDto: SetPaidJonPostDto,
  ) {
    const job = await this.jobPostService.findOne(id);
    this.checkSetPaidErrors(job, updateJobPostDto);

    const update = {
      paid: true,
      feeAmmount: updateJobPostDto.feeAmmount,
      paidAmmount: updateJobPostDto.feeAmmount,
    };
    return this.jobPostService.update(id, update);
  }

  private checkSetPaidErrors(
    job: JobPost,
    updateJobPostDto: SetPaidJonPostDto,
  ) {
    if (!job) {
      throw new HttpException(
        'Unable to set paid as job post not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (job.feeStructure === 'fixedFee' && !updateJobPostDto.feeAmmount) {
      throw new HttpException(
        'Unable to set paid as feeAmmount not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      job.feeStructure === 'fixedFee' &&
      job.feeAmmount !== updateJobPostDto.feeAmmount
    ) {
      throw new HttpException(
        'Unable to set paid as feeAmmount does not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (job.feeStructure === 'noWinNoFee') {
      this.checkWithin10Percent(job, updateJobPostDto);
    }
  }

  private checkWithin10Percent(
    job: JobPost,
    updateJobPostDto: SetPaidJonPostDto,
  ) {
    const feeAmmount = updateJobPostDto.feeAmmount;
    const min = job.settlementConstraints.min;
    const max = job.settlementConstraints.max;
    const feePercentage = job.feePercentage;

    const minFee = min * feePercentage;
    const maxFee = max * feePercentage;

    if (feeAmmount < minFee || feeAmmount > maxFee) {
      throw new HttpException(
        "Unable to set paid as feeAmmount isn't within expected range, contact your solicitior for more information.",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostService.remove(id);
  }
}
