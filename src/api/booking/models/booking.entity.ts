import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Car } from '../../car/models/car.entity';

export enum bookingStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
export enum pickUpStatus {
  PENDING = 'PENDING',
  PICKUP = 'PICKUP',
  RETURNED = 'RETURNED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  carId: string;

  @Column('date')
  @ApiProperty()
  public receivedDateTime: string;

  @Column('date')
  @ApiProperty()
  public returnDateTime: string;

  @Column()
  @ApiProperty()
  public pickUpLocationId: string;

  @Column('int')
  @ApiProperty({ default: 1 })
  public totalPrice: number;

  @Column()
  @ApiProperty()
  public discountCode: string;

  @Column()
  @ApiProperty()
  public transactionId: string;

  @Column({ type: 'enum', enum: bookingStatus })
  @ApiProperty()
  public bookingStatus: bookingStatus;

  @Column({ type: 'enum', enum: pickUpStatus })
  @ApiProperty()
  public pickUpStatus: pickUpStatus;

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
