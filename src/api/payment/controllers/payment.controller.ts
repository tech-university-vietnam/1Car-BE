import {
  Body,
  Controller,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateCheckoutSessionDTO } from '../models/payment.dto';
import { PaymentService } from '../services/payment.service';
import { Public } from '../../../decorators/public.decorator';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  @Inject(PaymentService)
  private readonly service: PaymentService;

  @Post('/checkout')
  @ApiCreatedResponse()
  public async createCheckoutSession(
    @Body() body: CreateCheckoutSessionDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const session = await this.service.createCheckoutSession(body, req);
    return res.json(session.url);
  }

  @Public()
  @Post('/webhook')
  public async handleIntentWebhook(@Req() request: RawBodyRequest<Request>) {
    return this.service.handleIntentWebhook(request);
  }
}
