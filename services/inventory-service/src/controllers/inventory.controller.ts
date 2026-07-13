import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('reserve')
  @HttpCode(HttpStatus.OK)
  reserve(@Body() body: { itemId: string; quantity: number }) {
    return this.inventoryService.reserveStock(body.itemId, body.quantity);
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  add(@Body() body: { itemId: string; quantity: number }) {
    return this.inventoryService.addStock(body.itemId, body.quantity);
  }

  @Get()
  findAll() {
    return this.inventoryService.getInventory();
  }

  @Get(':itemId')
  findOne(@Param('itemId') itemId: string) {
    return this.inventoryService.getInventoryItem(itemId);
  }
}
