import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './entities/transaction.entity';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { CategoriesService } from 'src/categories/categories.service';

import * as csvParser from 'csvtojson';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { category: categoryName } = createTransactionDto;

    try {
      await this.categoriesService.findByName(categoryName);
    } catch (error) {
      if (error.response.statusCode === 404) {
        this.categoriesService.create({
          name: categoryName,
          budgetLimit: createTransactionDto.amount,
        });
      } else {
        //TODO
        console.error('error in transaction creation');
        throw new BadRequestException('Transaction cant be created');
      }
    }

    const transaction = new this.transactionModel(createTransactionDto);
    return transaction.save();
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const {
      limit = 20,
      offset = 0,
      sortBy = 'updateddAt',
      startDate,
      endDate,
    } = paginationQuery;

    return this.aggregateTransactions(
      sortBy,
      startDate,
      endDate,
      limit,
      offset,
    );
  }

  async aggregateTransactions(
    sortBy: string,
    startDate: string,
    endDate: string,
    limit: number,
    offset: number,
  ) {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    const pipeline = [
      {
        $match:
          startDateObj && endDateObj
            ? {
                date: {
                  $gte: startDateObj,
                  $lte: endDateObj,
                },
              }
            : {},
      },
      {
        $sort: {
          [sortBy]: 1 as const,
        },
      },
      {
        $limit: limit,
      },
      {
        $skip: offset,
      },
    ];

    const result = await this.transactionModel.aggregate(pipeline).exec();
    return result;
  }

  async findOne(id: string) {
    const transaction = await this.transactionModel.findOne({ _id: id }).exec();
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(
        { _id: id },
        { $set: updateTransactionDto },
        { new: true },
      )
      .exec();
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    return transaction.deleteOne();
  }

  async getExpensesPerCategory(paginationQuery: PaginationQueryDto) {
    const { startDate, endDate } = paginationQuery;
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    const pipeline: any = [
      {
        $match:
          startDateObj && endDateObj
            ? {
                date: {
                  $gte: startDateObj,
                  $lte: endDateObj,
                },
              }
            : {},
      },
      { $match: { amount: { $gt: 0 } } },
      { $group: { _id: '$category', totalExpenses: { $sum: '$amount' } } },
      { $sort: { totalExpenses: -1 } },
    ];

    const results = await this.transactionModel.aggregate(pipeline);
    return results;
  }

  async convertCsvToJson(csvData: string) {
    try {
      const jsonObj = await csvParser().fromString(csvData);
      return jsonObj;
    } catch (error) {
      throw error;
    }
  }
  async uploadTransaction(data: string) {
    try {
      const uploadedTransactionsArr = await this.convertCsvToJson(data);
      const cleanedTransactionsArr: Array<any> = uploadedTransactionsArr.reduce(
        (acc, occ) => {
          const tags: Array<string> = occ.tags.split(',');
          const cleanedTags = tags.map((tag) => tag.trim());
          acc.push({
            ...occ,
            tags: cleanedTags,
          });
          return acc;
        },
        [],
      );
      for (let index = 0; index < cleanedTransactionsArr.length; index++) {
        await this.create(cleanedTransactionsArr[index]);
      }
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Upload failed');
    }
  }
}
