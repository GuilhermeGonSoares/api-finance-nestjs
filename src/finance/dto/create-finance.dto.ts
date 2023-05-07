import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FinanceType } from '../entities/finance.entity';

export class CreateFinanceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsEnum(FinanceType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;
}
