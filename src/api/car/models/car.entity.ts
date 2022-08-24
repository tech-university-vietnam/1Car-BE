import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import { CarStatus } from '../../../contains';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CarBrand } from './carBrand.entity';
import { CarSize } from './carSize.entity';
import { CarType } from './carType.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column({ type: 'text' })
  @ApiProperty({ default: 'Audi A8' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ default: 'Some words about this car' })
  public description: string;

  @Column({ type: 'text', default: CarStatus.AVAILABLE })
  @ApiProperty({ default: 'Available' })
  public status: CarStatus;

  @Column({ type: 'float' })
  @Min(0)
  @ApiProperty({ default: 10000.0 })
  public pricePerDate: number;

  @Column({ type: 'int', default: 0 })
  @Min(0)
  @ApiProperty({ default: 10 })
  public numberOfTrips: number;

  @Column({ type: 'float', default: 0 })
  @Min(0)
  @ApiProperty({ default: 10 })
  public numberOfKilometer: number;

  @Column({ type: 'text', nullable: true, default: [], array: true })
  @ApiProperty({ nullable: true, default: [] })
  public images: string[];

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  public locationId: string;

  @ManyToOne(() => CarType, { onDelete: 'SET NULL' })
  @ApiProperty({ nullable: true })
  public carType: CarType;

  @ManyToOne(() => CarBrand, { onDelete: 'SET NULL' })
  @ApiProperty({ nullable: true })
  public carBrand: CarBrand;

  @ManyToOne(() => CarSize, { onDelete: 'SET NULL' })
  @ApiProperty({ nullable: true })
  public carSize: CarSize;

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
