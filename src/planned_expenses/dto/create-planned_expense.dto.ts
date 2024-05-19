// src/planned-expenses/dto/create-planned-expense.dto.ts

import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class CreatePlannedExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
