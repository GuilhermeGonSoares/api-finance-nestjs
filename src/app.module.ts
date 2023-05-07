import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { CategoryModule } from './category/category.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CategoryModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
