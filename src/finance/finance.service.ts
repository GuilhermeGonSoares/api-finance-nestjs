import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Between, Repository } from 'typeorm';
import { Finance } from './entities/finance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { FinanceOrderBy, OrderDirection } from './dto/orderBy-finance.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepo: Repository<Finance>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createFinanceDto: CreateFinanceDto) {
    const { name, value, type, categoryName } = createFinanceDto;
    const category = await this.categoryService.findCategoryByName(
      categoryName,
    );
    const finance = this.financeRepo.create({ name, value, type, category });
    return await this.financeRepo.save(finance);
  }

  async findAll(order: FinanceOrderBy, direction: OrderDirection) {
    if (!order) {
      return await this.financeRepo.find({
        relations: {
          category: true,
        },
      });
    }

    return await this.financeRepo.find({
      relations: {
        category: true,
      },
      order: {
        [order]: direction || OrderDirection.ASC,
      },
    });
  }

  async findOne(id: number) {
    const finance = await this.financeRepo.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    if (!finance) {
      throw new NotFoundException(`Not found finance with this ${id} id`);
    }

    return finance;
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto) {
    const finance = await this.findOne(id);
    const { categoryName } = updateFinanceDto;
    if (categoryName) {
      const category = await this.categoryService.findCategoryByName(
        categoryName,
      );
      finance.category = category;
    }
    return await this.financeRepo.save({ ...finance, ...updateFinanceDto });
  }

  async remove(id: number) {
    const finance = await this.findOne(id);
    return await this.financeRepo.remove(finance);
  }

  private async findFinanceByMonth(month: string): Promise<Finance[]> {
    const monthNumber = this.getMonthNumber(month);
    const startDate = new Date(new Date().getFullYear(), monthNumber, 1);
    const endDate = new Date(new Date().getFullYear(), monthNumber + 1, 1);
    endDate.setUTCHours(0, 0, 0, 0);
    const finances = await this.financeRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    return finances;
  }

  async balance(month: string) {
    let balanceMoney = 0,
      totalDeposit = 0;
    const finances = await this.findFinanceByMonth(month);
    finances.forEach((finance) => {
      if (finance.type === 'deposit') {
        balanceMoney += finance.value;
        totalDeposit += finance.value;
      } else {
        balanceMoney -= finance.value;
      }
    });

    return {
      balance: balanceMoney,
      totalDeposit,
      totalWithdraw: totalDeposit - balanceMoney,
    };
  }

  private getMonthNumber(monthName: string): number {
    const monthNames = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];
    const index = monthNames.indexOf(monthName.toLowerCase());

    if (index === -1) {
      throw new BadRequestException(`Invalid month name: ${monthName}`);
    }

    return index;
  }
}
