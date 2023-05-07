import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Repository } from 'typeorm';
import { Finance } from './entities/finance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';

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

  async findAll() {
    return await this.financeRepo.find({
      relations: {
        category: true,
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
    return await this.financeRepo.save({ ...finance, ...updateFinanceDto });
  }

  async remove(id: number) {
    const finance = await this.findOne(id);
    return await this.financeRepo.remove(finance);
  }
}
