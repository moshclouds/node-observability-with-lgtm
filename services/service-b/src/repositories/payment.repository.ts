import { Injectable } from '@nestjs/common';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

@Injectable()
export class PaymentRepository {
  private payments: Map<string, Payment> = new Map();

  create(paymentData: Omit<Payment, 'id' | 'createdAt'>): Payment {
    const id = Math.random().toString(36).substring(2, 9);
    const payment: Payment = {
      id,
      ...paymentData,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  findById(id: string): Payment | undefined {
    return this.payments.get(id);
  }

  findAll(): Payment[] {
    return Array.from(this.payments.values());
  }
}
