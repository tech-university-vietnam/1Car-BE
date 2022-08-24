import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CarSize {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column({ type: 'text' })
  @ApiProperty({ default: '6 seats' })
  public name: string;

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