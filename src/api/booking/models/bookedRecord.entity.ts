import { Car } from './../../car/models/car.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BookedRecord {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @Column('timestamp')
  @ApiProperty()
  public bookedDate: Date;

  @ManyToMany(() => Car, { onDelete: 'CASCADE' })
  @JoinTable()
  @ApiProperty({ nullable: false })
  public bookedCars: Car[];
  /*
   * Create and Update Date Columns
   */
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
