import { Injectable } from '@nestjs/common';
import { CreatePlannedExpenseDto } from './dto/create-planned_expense.dto';
import { UpdatePlannedExpenseDto } from './dto/update-planned_expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PlannedExpense } from './entities/planned_expense.entity';
import { Model } from 'mongoose';

@Injectable()
export class PlannedExpensesService {
  constructor(
    @InjectModel(PlannedExpense.name)
    private plannedExpenseModel: Model<PlannedExpense>,
  ) {}

  create(
    createPlannedExpenseDto: CreatePlannedExpenseDto,
  ): Promise<PlannedExpense> {
    const createdPlannedExpense = new this.plannedExpenseModel(
      createPlannedExpenseDto,
    );
    return createdPlannedExpense.save();
  }
  findAll(): Promise<PlannedExpense[]> {
    return this.plannedExpenseModel.find().exec();
  }

  findOne(id: string): Promise<PlannedExpense> {
    return this.plannedExpenseModel.findById(id).exec();
  }

  update(id: string, updatePlannedExpenseDto: UpdatePlannedExpenseDto): Promise<PlannedExpense> {
    return this.plannedExpenseModel.findByIdAndUpdate(id, updatePlannedExpenseDto, { new: true }).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} plannedExpense`;
  }
}
