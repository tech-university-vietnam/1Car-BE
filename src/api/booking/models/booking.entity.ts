import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('timestamp', { nullable: true })
  @ApiProperty()
  public receivedDateTime!: Date;

  @Column('timestamp')
  @ApiProperty()
  public returnDateTime: Date;

  @Column()
  @ApiProperty()
  public pickUpLocationId: string;

  @Column('int')
  @ApiProperty({ default: 1 })
  public totalPrice: number;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  @ApiProperty()
  public discountCode!: string;

  @Column({ nullable: true })
  @ApiProperty()
  public transactionId!: string;

  @Column({ type: 'enum', enum: bookingStatus, default: bookingStatus.PENDING })
  @ApiProperty()
  public bookingStatus: bookingStatus;

  @Column({ type: 'enum', enum: pickUpStatus, default: pickUpStatus.PENDING })
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
