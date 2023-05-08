import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    await this.existUser(email);

    createUserDto.password = await this.createPasswordHash(password);
    const user = this.userRepo.create(createUserDto);

    return await this.userRepo.save(user);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async existUser(email: string) {
    const exist = await this.userRepo.exist({ where: { email } });

    if (exist) {
      throw new BadRequestException(
        `There is already a user with this ${email}`,
      );
    }

    return exist;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Not found user with this ${id} id`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, password } = updateUserDto;
    const user = await this.findOne(id);

    if (email && email !== user.email) {
      await this.existUser(email);
    }

    if (password) {
      updateUserDto.password = await this.createPasswordHash(password);
    }

    return await this.userRepo.save({ ...user, ...updateUserDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return await this.userRepo.remove(user);
  }

  private async createPasswordHash(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
