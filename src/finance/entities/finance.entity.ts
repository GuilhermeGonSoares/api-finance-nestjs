import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FinanceType {
  deposit,
  withdraw,
}

@Entity({ name: 'finances' })
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column({ name: 'type_finance', type: 'varchar' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationship
  @ManyToOne(() => Category, (category) => category.finances)
  category: Category;

  @ManyToOne(() => User, (user) => user.finances, { onDelete: 'CASCADE' })
  user: User;
}
