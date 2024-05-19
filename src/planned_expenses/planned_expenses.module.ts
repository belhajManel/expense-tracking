import { Module } from '@nestjs/common';
import { PlannedExpensesService } from './planned_expenses.service';
import { PlannedExpensesController } from './planned_expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlannedExpense, PlannedExpenseSchema } from './entities/planned_expense.entity';

@Module({
  controllers: [PlannedExpensesController],
  providers: [PlannedExpensesService],
  imports: [
    MongooseModule.forFeature([{ name: PlannedExpense.name, schema: PlannedExpenseSchema }]),
  ],
})
export class PlannedExpensesModule {}
