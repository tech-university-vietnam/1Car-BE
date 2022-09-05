import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarStatus } from '../../../contains';
import { CarAttribute } from './carAttribute.entity';

export enum carStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

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

  @ManyToMany(() => CarAttribute, { onDelete: 'CASCADE' })
  @JoinTable()
  @ApiProperty({ nullable: true })
  public attributes: CarAttribute[];

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
