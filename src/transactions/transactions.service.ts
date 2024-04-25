import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './entities/transaction.entity';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
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
}
