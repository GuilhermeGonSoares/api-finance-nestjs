import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'This valeu need to be string' })
  @IsNotEmpty()
  name: string;
}
