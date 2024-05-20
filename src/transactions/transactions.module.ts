import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { IamModule } from 'src/iam/iam.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    IamModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    CategoriesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, JwtService],
  exports: [MongooseModule, TransactionsService],
})
export class TransactionsModule {}
