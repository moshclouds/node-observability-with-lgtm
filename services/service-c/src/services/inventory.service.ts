import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InventoryRepository, InventoryItem } from '../repositories/inventory.repository';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async reserveStock(itemId: string, quantity: number): Promise<InventoryItem> {
    this.logger.log(`Request received to reserve stock. Item ID: ${itemId}, Requested Quantity: ${quantity}`);

    // Simulate small database delay
    await new Promise((resolve) => setTimeout(resolve, 80));

    const item = this.inventoryRepository.findByItemId(itemId);
    if (!item) {
      this.logger.warn(`Reservation failed: Item ID ${itemId} not found in catalog`);
      throw new HttpException(`Item ${itemId} not found`, HttpStatus.NOT_FOUND);
    }

    if (item.stock < quantity) {
      this.logger.warn(`Reservation failed: Insufficient stock for Item ID ${itemId}. Catalog Stock: ${item.stock}, Requested: ${quantity}`);
      throw new HttpException(
        `Insufficient stock for item ${itemId}. Available: ${item.stock}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update stock
    const updatedItem = this.inventoryRepository.createOrUpdateItem(itemId, item.stock - quantity);
    this.logger.log(`Stock reservation successful. Item ID: ${itemId}, Quantity Deducted: ${quantity}, Remaining stock: ${updatedItem.stock}`);
    return updatedItem;
  }

  addStock(itemId: string, quantity: number): InventoryItem {
    this.logger.log(`Request received to restock Item ID: ${itemId}, Added Quantity: ${quantity}`);
    const item = this.inventoryRepository.findByItemId(itemId);
    const currentStock = item ? item.stock : 0;
    const updatedItem = this.inventoryRepository.createOrUpdateItem(itemId, currentStock + quantity);
    this.logger.log(`Restock completed. Item ID: ${itemId}, Previous Stock: ${currentStock}, New Stock: ${updatedItem.stock}`);
    return updatedItem;
  }

  getInventory(): InventoryItem[] {
    this.logger.log('Fetching all inventory items from catalog');
    const items = this.inventoryRepository.findAll();
    this.logger.debug(`Retrieved ${items.length} inventory items total`);
    return items;
  }

  getInventoryItem(itemId: string): InventoryItem {
    this.logger.log(`Fetching stock details for Item ID: ${itemId}`);
    const item = this.inventoryRepository.findByItemId(itemId);
    if (!item) {
      this.logger.warn(`Fetch failed: Item ID ${itemId} not found in catalog`);
      throw new HttpException('Inventory item not found', HttpStatus.NOT_FOUND);
    }
    this.logger.debug(`Successfully retrieved stock level for Item ID: ${itemId}. Stock: ${item.stock}`);
    return item;
  }
}
