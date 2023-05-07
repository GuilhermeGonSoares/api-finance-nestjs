import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existCategory = await this.categoryRepo.count({
      where: { name },
    });

    if (existCategory > 0) {
      throw new ConflictException('Name already exists');
    }

    const category = this.categoryRepo.create({ name });
    return await this.categoryRepo.save(category);
  }

  async findAll() {
    return await this.categoryRepo.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Not found category with this ${id}`);
    }
    return category;
  }

  async findCategoryByName(name: string) {
    const category = await this.categoryRepo.findOne({ where: { name } });
    if (!category) {
      throw new NotFoundException(`Not found category with this name: ${name}`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    return await this.categoryRepo.save({ ...category, ...updateCategoryDto });
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    return await this.categoryRepo.remove(category);
  }
}
