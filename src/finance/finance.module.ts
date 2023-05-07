import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Finance } from './entities/finance.entity';
import { CategoryModule } from 'src/category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Finance]), CategoryModule],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
