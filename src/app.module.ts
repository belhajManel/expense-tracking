import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ReportsModule } from './reports/reports.module';
import { PlannedExpensesService } from './planned_expenses/planned_expenses.service';
import { PlannedExpensesModule } from './planned_expenses/planned_expenses.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './iam/config/jwt.config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    //MongooseModule.forRoot('mongodb://localhost:27017/expense-tracking'),
    MongooseModule.forRoot(
      'mongodb+srv://mohamedghayth12:ghaythafli@nest-project.im7feid.mongodb.net/?retryWrites=true&w=majority&appName=nest-project',
    ),
    UsersModule,
    TransactionsModule,
    CategoriesModule,
    BudgetsModule,
    ReportsModule,
    PlannedExpensesModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService, PlannedExpensesService, JwtService],
})
export class AppModule {}
