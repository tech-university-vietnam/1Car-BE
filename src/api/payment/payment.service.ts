import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDTO } from './payment.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  @InjectRepository(Payment)
  private readonly repository: Repository<Payment>;

  public getPayment(id: string): Promise<Payment> {
    return this.repository.findOneBy({ id: id });
  }

  public createPayment(body: CreatePaymentDTO): Promise<Payment> {
    const payment: Payment = new Payment();

    return this.repository.save(payment);
  }
}
