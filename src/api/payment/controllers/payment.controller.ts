import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDTO } from '../models/payment.dto';
import { Payment } from '../models/payment.entity';
import { PaymentService } from '../services/payment.service';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  @Inject(PaymentService)
  private readonly service: PaymentService;

  @Get(':id')
  public getPayment(@Param('id') id: string): Promise<Payment> {
    return this.service.getPayment(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Payment })
  public createPayment(@Body() body: CreatePaymentDTO): Promise<Payment> {
    return this.service.createPayment(body);
  }
}
