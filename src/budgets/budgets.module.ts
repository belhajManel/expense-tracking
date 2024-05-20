import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { PlannedExpensesModule } from 'src/planned_expenses/planned_expenses.module';
import { BudgetSchema } from './entities/budget.entity';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [
    MongooseModule.forFeature([{ name: 'Budget', schema: BudgetSchema }]), // Add your BudgetSchema if needed
    TransactionsModule,
    PlannedExpensesModule,
  ],
})
export class BudgetsModule {}
