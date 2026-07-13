import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: { orderId: string; amount: number }) {
    return this.paymentService.processPayment(body.orderId, body.amount);
  }

  @Get()
  findAll() {
    return this.paymentService.getAllPayments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.getPayment(id);
  }
}
