import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarAttributeType } from './carAttributeType.entity';

@Entity()
export class CarAttribute {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @ApiProperty()
  @ManyToOne(() => CarAttributeType, (attribute) => attribute.type)
  public type: CarAttributeType;

  @Column({ type: 'text' })
  @ApiProperty({ default: 'Audi' })
  public value: string;

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
  attribute: Promise<CarAttributeType>;
}
