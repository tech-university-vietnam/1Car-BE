import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty()
  public name: string;

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty()
  public email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty()
  public userRole: UserRole;

  @Column({ type: 'varchar', length: 120, nullable: true })
  @ApiProperty({ required: false, nullable: false })
  public phoneNumber?: string = null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  @ApiProperty({ required: false, nullable: false })
  public dateOfBirth?: string = null;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ default: false })
  public isDeleted: boolean;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  public updatedAt!: Date;
}
