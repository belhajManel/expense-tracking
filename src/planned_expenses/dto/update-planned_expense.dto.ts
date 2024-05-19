import { PartialType } from '@nestjs/swagger';
import { CreatePlannedExpenseDto } from './create-planned_expense.dto';

export class UpdatePlannedExpenseDto extends PartialType(CreatePlannedExpenseDto) {}
