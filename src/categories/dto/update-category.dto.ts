import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCategoryDto {
  @IsPositive()
  @IsNotEmpty()
  budgetLimit: number;
}
