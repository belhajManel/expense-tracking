import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateTransactionDto {
  @IsPositive()
  @IsNotEmpty()
  amount: number;
  @IsISO8601({ strict: true })
  @Length(10, 10)
  date: string;
  @IsString()
  @IsNotEmpty()
  category: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
