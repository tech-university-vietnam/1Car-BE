import {
  Body,
  Controller,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { CreateCheckoutSessionDTO } from '../models/payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  @Inject(PaymentService)
  private readonly service: PaymentService;

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  @ApiCreatedResponse()
  public async createCheckoutSession(
    @Body() body: CreateCheckoutSessionDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const session = await this.service.createCheckoutSession(body, req);
    return res.redirect(session.url);
  }

  @Post('/webhook')
  public async handleIntentWebhook(@Req() request: RawBodyRequest<Request>) {
    return this.service.handleIntentWebhook(request);
  }
}
