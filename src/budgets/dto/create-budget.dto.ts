// src/budget/dto/create-budget.dto.ts

import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
