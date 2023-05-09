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
import {
  FinanceTypeOrderByDto,
  OrderDirection,
} from './dto/orderBy-finance.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepo: Repository<Finance>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createFinanceDto: CreateFinanceDto, user: User) {
    const { name, value, type, categoryName } = createFinanceDto;
    const category = await this.categoryService.findCategoryByName(
      categoryName,
    );
    const finance = this.financeRepo.create({
      name,
      value,
      type,
      category: {
        id: category.id,
        name: category.name,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    return await this.financeRepo.save(finance);
  }

  async findAll(typeAndOrderBy: FinanceTypeOrderByDto, user: User) {
    const { type, direction, orderBy } = typeAndOrderBy;
    if (direction && !orderBy) {
      throw new BadRequestException(
        'Order direction cannot be used without order by.',
      );
    }
    const order = orderBy ? { [orderBy]: direction || OrderDirection.ASC } : {};

    const where = type
      ? { type, user: { id: user.id } }
      : { user: { id: user.id } };

    return await this.financeRepo.find({
      relations: {
        category: true,
      },
      where,
      order,
    });
  }

  async findOne(id: number, user: User) {
    const finance = await this.financeRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: {
        category: true,
      },
    });
    if (!finance) {
      throw new NotFoundException(
        `Finance not found with this ${id} id for user name: ${user.name}`,
      );
    }

    return finance;
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto, user: User) {
    const finance = await this.findOne(id, user);
    const { categoryName } = updateFinanceDto;
    if (categoryName) {
      const category = await this.categoryService.findCategoryByName(
        categoryName,
      );
      finance.category = category;
    }
    return await this.financeRepo.save({ ...finance, ...updateFinanceDto });
  }

  async remove(id: number, user: User) {
    const finance = await this.findOne(id, user);
    return await this.financeRepo.remove(finance);
  }

  private async findFinanceByMonth(
    month: string,
    user: User,
  ): Promise<Finance[]> {
    const monthNumber = this.getMonthNumber(month);
    const startDate = new Date(new Date().getFullYear(), monthNumber, 1);
    const endDate = new Date(new Date().getFullYear(), monthNumber + 1, 1);
    endDate.setUTCHours(0, 0, 0, 0);
    const finances = await this.financeRepo.find({
      where: {
        user: { id: user.id },
        createdAt: Between(startDate, endDate),
      },
    });

    return finances;
  }

  async balance(month: string, user: User) {
    let balanceMoney = 0,
      totalDeposit = 0;
    const finances = await this.findFinanceByMonth(month, user);
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
