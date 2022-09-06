import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CarAttributeType {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column({ type: 'text' })
  @ApiProperty()
  public type: string;

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
