import { Test, TestingModule } from '@nestjs/testing';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

// TODO: Set up a mock of the mongoose api
// Would want to create a propper
describe('JobPostController', () => {
  let controller: JobPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostController],
      providers: [JobPostService],
    }).compile();

    controller = module.get<JobPostController>(JobPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should only allow settlements within solicitor specified range', () => {
    const job = {
      feeStructure: 'noWinNoFee',
      settlementConstraints: {
        min: 1000,
        max: 10000,
      },
      feePercentage: 0.1,
      started: true,
      title: 'title',
      description: 'description',
      paid: false,
    };

    const lowSettlement = {
      feeAmmount: 100,
    };

    const highSettlement = {
      feeAmmount: 100000,
    };

    const correctCettlement = {
      feeAmmount: 1001,
    };

    expect(controller.checkWithin10Percent(job, lowSettlement)).toThrow();
    expect(controller.checkWithin10Percent(job, highSettlement)).toThrow();
    expect(
      controller.checkWithin10Percent(job, correctCettlement),
    ).not.toThrow();
  });
});
