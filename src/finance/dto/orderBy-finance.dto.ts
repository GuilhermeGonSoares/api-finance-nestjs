import { IsIn, IsOptional } from 'class-validator';

export type FinanceOrderBy = 'value' | 'createdAt';

export type FinanceType = 'deposit' | 'withdraw';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FinanceTypeOrderByDto {
  @IsOptional()
  @IsIn(['deposit', 'withdraw'])
  type: FinanceType;

  @IsOptional()
  @IsIn(['value', 'createdAt'])
  orderBy: FinanceOrderBy;

  @IsOptional()
  @IsIn([OrderDirection.ASC, OrderDirection.DESC])
  direction: OrderDirection;
}
