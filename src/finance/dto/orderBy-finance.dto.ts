import { IsIn, IsOptional } from 'class-validator';

export type FinanceOrderBy = 'value' | 'createdAt';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FinanceOrderByDto {
  @IsOptional()
  @IsIn(['value', 'createdAt'])
  order: FinanceOrderBy;

  @IsOptional()
  @IsIn([OrderDirection.ASC, OrderDirection.DESC])
  direction: OrderDirection;
}
