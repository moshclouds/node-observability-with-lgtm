import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentRepository, Payment } from '../repositories/payment.repository';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly paymentRepository: PaymentRepository) {}

  async processPayment(orderId: string, amount: number): Promise<Payment> {
    this.logger.log(`Request received to process payment for Order ID: ${orderId}, Amount: $${amount}`);

    // Simulate small network/processing delay (100ms)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock payment check - fail if amount is negative
    if (amount <= 0) {
      this.logger.warn(`Payment authorization failed for Order ID: ${orderId}. Rejected amount: $${amount} (must be greater than 0)`);
      throw new HttpException('Invalid payment amount', HttpStatus.BAD_REQUEST);
    }

    const payment = this.paymentRepository.create({
      orderId,
      amount,
      status: 'SUCCESS',
    });

    this.logger.log(`Payment successfully completed and logged. Transaction ID: ${payment.id}, Order ID: ${orderId}, Status: ${payment.status}`);
    return payment;
  }

  getPayment(id: string): Payment {
    this.logger.log(`Fetching details for Payment/Transaction ID: ${id}`);
    const payment = this.paymentRepository.findById(id);
    if (!payment) {
      this.logger.warn(`Fetch failed: Payment ID: ${id} not found in repository`);
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    this.logger.debug(`Successfully retrieved Payment ID: ${id}`);
    return payment;
  }

  getAllPayments(): Payment[] {
    this.logger.log('Fetching all payment records from repository');
    const payments = this.paymentRepository.findAll();
    this.logger.debug(`Retrieved ${payments.length} payment records total`);
    return payments;
  }
}
