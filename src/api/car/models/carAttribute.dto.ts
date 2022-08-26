import { IsString } from 'class-validator';

export class CreateCarAttributeDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}
