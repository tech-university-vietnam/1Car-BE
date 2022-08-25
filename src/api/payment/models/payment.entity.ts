import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/api/booking/models/booking.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  public id!: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ default: false })
  public isDeleted: boolean;

  @OneToOne(() => Booking)
  @JoinColumn({ name: 'bookingId', referencedColumnName: 'id' })
  public booking: Booking;

  @Column()
  public bookingId: string;

  @Column()
  public stripePaymentId: string;

  @Column()
  public amount: number;

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
