import { Test, TestingModule } from '@nestjs/testing';
import { PlannedExpensesService } from './planned_expenses.service';

describe('PlannedExpensesService', () => {
  let service: PlannedExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlannedExpensesService],
    }).compile();

    service = module.get<PlannedExpensesService>(PlannedExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
