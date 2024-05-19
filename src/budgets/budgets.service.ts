import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { PlannedExpense } from 'src/planned_expenses/entities/planned_expense.entity';
import { Model } from 'mongoose';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(PlannedExpense.name)
    private plannedExpenseModel: Model<PlannedExpense>,
  ) {}

  async calculateMonthlyBudget(month: number, year: number): Promise<any> {
    const transactions = await this.transactionModel
      .find({
        date: {
          $gte: new Date(year, month, 1),
          $lte: new Date(year, month + 1, 0),
        },
      })
      .exec();

    const plannedExpenses = await this.plannedExpenseModel
      .find({
        date: {
          $gte: new Date(year, month, 1),
          $lte: new Date(year, month + 1, 0),
        },
      })
      .exec();

    const totalSpent = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    const totalPlanned = plannedExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0,
    );

    return {
      totalSpent,
      totalPlanned,
      totalBudget: totalSpent + totalPlanned,
    };
  }
  create(createBudgetDto: CreateBudgetDto) {
    return 'This action adds a new budget';
  }

  findAll() {
    return `This action returns all budgets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
