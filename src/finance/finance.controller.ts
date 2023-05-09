import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Month } from 'src/decorators/month.decorator';
import { FinanceTypeOrderByDto } from './dto/orderBy-finance.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin, Role.User)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(
    @Body() createFinanceDto: CreateFinanceDto,
    @UserDecorator() user: User,
  ) {
    return this.financeService.create(createFinanceDto, user);
  }

  @Get()
  findAll(
    @Query() typeAndOrderBy: FinanceTypeOrderByDto,
    @UserDecorator() user: User,
  ) {
    return this.financeService.findAll(typeAndOrderBy, user);
  }

  @Get('/balance')
  balanceMonth(@Month() month: string, @UserDecorator() user: User) {
    return this.financeService.balance(month, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserDecorator() user: User) {
    return this.financeService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFinanceDto: UpdateFinanceDto,
    @UserDecorator() user: User,
  ) {
    return this.financeService.update(id, updateFinanceDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserDecorator() user: User) {
    return this.financeService.remove(id, user);
  }
}
