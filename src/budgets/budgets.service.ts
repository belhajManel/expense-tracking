import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { PlannedExpense } from 'src/planned_expenses/entities/planned_expense.entity';
import { Model } from 'mongoose';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(PlannedExpense.name)
    private plannedExpenseModel: Model<PlannedExpense>,
  ) {}

  create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const createdBudget = new this.budgetModel(createBudgetDto);
    return createdBudget.save();
  }

  findAll(): Promise<Budget[]> {
    return this.budgetModel.find().populate('category').exec();
  }
  //check this later 
  // async calculateMonthlyBudget(month: number, year: number): Promise<any> {
  //   const transactions = await this.transactionModel
  //     .find({
  //       date: {
  //         $gte: new Date(year, month - 1, 1),
  //         $lte: new Date(year, month, 0),
  //       },
  //     })
  //     .exec();

  //   const plannedExpenses = await this.plannedExpenseModel
  //     .find({
  //       date: {
  //         $gte: new Date(year, month - 1, 1),
  //         $lte: new Date(year, month, 0),
  //       },
  //     })
  //     .exec();

  //   const totalSpent = transactions.reduce(
  //     (acc, transaction) => acc + transaction.amount,
  //     0,
  //   );
  //   const totalPlanned = plannedExpenses.reduce(
  //     (acc, expense) => acc + expense.amount,
  //     0,
  //   );

  //   const budgets = await this.findAll();
  //   const alerts = [];

  //   for (const budget of budgets) {
  //     const categorySpent = transactions
  //       .filter((transaction) =>
  //         transaction.category.equals(budget.category._id),
  //       )
  //       .reduce((acc, transaction) => acc + transaction.amount, 0);

  //     if (categorySpent > budget.amount) {
  //       alerts.push(
  //         `Alert: Spending in category ${budget.category.name} has exceeded the budget.`,
  //       );
  //     }
  //   }

  //   return {
  //     totalSpent,
  //     totalPlanned,
  //     totalBudget: totalSpent + totalPlanned,
  //     alerts,
  //   };
  // }
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
