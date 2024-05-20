import { Module } from '@nestjs/common';
import { PlannedExpensesService } from './planned_expenses.service';
import { PlannedExpensesController } from './planned_expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PlannedExpense,
  PlannedExpenseSchema,
} from './entities/planned_expense.entity';
import { IamModule } from 'src/iam/iam.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PlannedExpensesController],
  providers: [PlannedExpensesService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: PlannedExpense.name, schema: PlannedExpenseSchema },
    ]),
  ],
  exports: [MongooseModule, PlannedExpensesService],
})
export class PlannedExpensesModule {}
