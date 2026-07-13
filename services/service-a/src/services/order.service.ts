import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { OrderRepository, Order } from '../repositories/order.repository';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(`Request received to create order for Item ID: ${createOrderDto.itemId}, Quantity: ${createOrderDto.quantity}, Unit Price: ${createOrderDto.price}`);

    // 1. Create order with PENDING status in repository
    const order = this.orderRepository.create({
      itemId: createOrderDto.itemId,
      quantity: createOrderDto.quantity,
      price: createOrderDto.price,
      status: 'PENDING',
    });
    this.logger.log(`Order record created in repository with PENDING state. Order ID: ${order.id}`);

    try {
      // 2. Call Service B to process payment
      const paymentUrl = `${process.env.PAYMENT_SERVICE_URL || 'http://service-b:3000'}/payments`;
      this.logger.log(`Initiating payment validation for Order ID: ${order.id}. URL: ${paymentUrl}`);
      
      const paymentResponse = await fetch(paymentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.price * order.quantity,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error(`Payment service returned HTTP status ${paymentResponse.status}`);
      }

      const paymentData = await paymentResponse.json();
      this.logger.log(`Payment successfully authorized for Order ID: ${order.id}. Transaction ID: ${paymentData.id}`);

      // 3. Call Service C to reserve inventory
      const inventoryUrl = `${process.env.INVENTORY_SERVICE_URL || 'http://service-c:3000'}/inventory/reserve`;
      this.logger.log(`Initiating stock reservation for Item ID: ${order.itemId}, Quantity: ${order.quantity}. URL: ${inventoryUrl}`);

      const inventoryResponse = await fetch(inventoryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: order.itemId,
          quantity: order.quantity,
        }),
      });

      if (!inventoryResponse.ok) {
        throw new Error(`Inventory service returned HTTP status ${inventoryResponse.status}`);
      }

      this.logger.log(`Stock successfully reserved for Order ID: ${order.id}`);

      // 4. Update status to CONFIRMED
      this.orderRepository.updateStatus(order.id, 'CONFIRMED');
      this.logger.log(`Order ID: ${order.id} status successfully updated to CONFIRMED`);
      return this.orderRepository.findById(order.id)!;

    } catch (error) {
      this.logger.error(`Order processing failed for Order ID: ${order.id}. Error Details: ${error.message}`);
      this.orderRepository.updateStatus(order.id, 'FAILED');
      this.logger.warn(`Order ID: ${order.id} status marked as FAILED due to processing error`);
      throw new HttpException(
        `Order processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getOrder(id: string): Order {
    this.logger.log(`Fetching details for Order ID: ${id}`);
    const order = this.orderRepository.findById(id);
    if (!order) {
      this.logger.warn(`Fetch failed: Order ID: ${id} not found in repository`);
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    this.logger.debug(`Successfully retrieved Order ID: ${id}`);
    return order;
  }

  getAllOrders(): Order[] {
    this.logger.log('Fetching all orders from repository');
    const orders = this.orderRepository.findAll();
    this.logger.debug(`Retrieved ${orders.length} orders total`);
    return orders;
  }

  deleteOrder(id: string): void {
    this.logger.log(`Request received to delete Order ID: ${id}`);
    const success = this.orderRepository.delete(id);
    if (!success) {
      this.logger.warn(`Deletion failed: Order ID: ${id} not found in repository`);
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Order ID: ${id} successfully deleted from repository`);
  }
}

