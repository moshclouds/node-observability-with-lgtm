import { Injectable } from '@nestjs/common';

export interface Order {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: Date;
}

@Injectable()
export class OrderRepository {
  private orders: Map<string, Order> = new Map();

  create(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const id = Math.random().toString(36).substring(2, 9);
    const order: Order = {
      id,
      ...orderData,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  findById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  findAll(): Order[] {
    return Array.from(this.orders.values());
  }

  updateStatus(id: string, status: string): Order | undefined {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
    }
    return order;
  }

  delete(id: string): boolean {
    return this.orders.delete(id);
  }
}
