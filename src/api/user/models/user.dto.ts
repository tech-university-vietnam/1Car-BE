import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public name: string;

  constructor(email, name) {
    this.email = email;
    this.name = name;
  }
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public phoneNumber: string;

  constructor(name: string, dateOfBirth: string, phoneNumber: string) {
    this.name = name;
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
  }
}

export class UpdateUserToAdminDto {
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  userRole?: string;
}

export class UpdateUserByAdminDto {
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  dateOfBirth?: string;

  @IsString()
  @ApiProperty()
  phoneNumber?: string;
}
