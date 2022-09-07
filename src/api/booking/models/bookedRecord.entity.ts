import { Car } from './../../car/models/car.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BookedRecord {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @ApiProperty()
  @ManyToOne(() => Car, (car) => car.bookTime, { onDelete: 'CASCADE' })
  public car: Car;

  @Column({ type: 'tstzrange' })
  public bookTime: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ default: false })
  public isDeleted: boolean;
  /*
   * Create and Update Date Columns
   */
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
