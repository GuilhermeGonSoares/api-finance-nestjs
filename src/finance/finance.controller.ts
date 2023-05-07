import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Month } from 'src/decorators/month.decorator';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto) {
    return this.financeService.create(createFinanceDto);
  }

  @Get()
  findAll() {
    return this.financeService.findAll();
  }

  @Get('/balance')
  balanceMonth(@Month() month: string) {
    return this.financeService.balance(month);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.financeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    return this.financeService.update(id, updateFinanceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.financeService.remove(id);
  }
}
