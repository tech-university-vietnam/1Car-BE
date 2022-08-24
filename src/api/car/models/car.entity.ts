import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum carStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty()
  public ownerId: string;

  @Column({ type: 'varchar', length: 300 })
  @ApiProperty()
  public description: string;

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty()
  public carImages: string; //link to external database

  @Column({ type: 'varchar', length: 120 })
  @ApiProperty()
  public carName: string;
  //TODO: add car type table
  @Column()
  @ApiProperty()
  public carTypeId: string;
  //TODO: add brand table
  @Column()
  @ApiProperty()
  public brandId: string;
  //TODO: add location table
  @Column()
  @ApiProperty()
  public locationId: string;

  @Column({
    type: 'enum',
    enum: carStatus,
    default: carStatus.UNAVAILABLE,
  })
  @ApiProperty()
  public status: carStatus;

  @Column('int')
  @ApiProperty()
  public pricePerDay: number;

  @Column('int')
  @ApiProperty()
  public numberOfTrips: number;

  @Column('int')
  @ApiProperty()
  public numberOfKilometer: number;

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
