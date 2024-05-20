import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { IamModule } from 'src/iam/iam.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TransactionsModule, IamModule],
  controllers: [ReportsController],
  providers: [ReportsService, JwtService],
})
export class ReportsModule {}
