import { Injectable } from '@nestjs/common';

export interface InventoryItem {
  itemId: string;
  stock: number;
}

@Injectable()
export class InventoryRepository {
  private inventory: Map<string, InventoryItem> = new Map();

  constructor() {
    // Seed default inventory items for testing
    this.inventory.set('item-1', { itemId: 'item-1', stock: 100 });
    this.inventory.set('item-2', { itemId: 'item-2', stock: 50 });
    this.inventory.set('item-3', { itemId: 'item-3', stock: 10 });
  }

  createOrUpdateItem(itemId: string, stock: number): InventoryItem {
    const item = { itemId, stock };
    this.inventory.set(itemId, item);
    return item;
  }

  findByItemId(itemId: string): InventoryItem | undefined {
    return this.inventory.get(itemId);
  }

  findAll(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }
}
