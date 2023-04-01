import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Get last orders' })
  @ApiResponse({ status: 200, description: 'Returns the last orders.' })
  @Get('last')
  getLastOrders() {
    return this.ordersService.getLastOrders();
  }

  @ApiOperation({ summary: 'Get orders report' })
  @ApiResponse({
    status: 200,
    description: 'Returns the orders report for the given quote.',
  })
  @Get('reports/:quote')
  getOrdersReport(@Param('quote') quote: string) {
    return this.ordersService.getOrdersReport(quote);
  }

  @ApiOperation({ summary: 'Get order by IDs' })
  @ApiResponse({
    status: 200,
    description: 'Returns the order with the given IDs.',
  })
  @Get(':orderId/:clientOrderId')
  getOrder(
    @Param('orderId') orderId: string,
    @Param('clientOrderId') clientOrderId: string,
  ) {
    return this.ordersService.getOrder(parseInt(orderId), parseInt(clientOrderId));
  }

  @ApiOperation({ summary: 'Get orders' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the orders for the given symbol (if provided), or all orders otherwise.',
  })
  @Get(':symbol?')
  getOrders(@Query('symbol') symbol?: string) {
    return this.ordersService.getOrders(symbol);
  }

  @ApiOperation({ summary: 'Sync order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Syncs the order with the given ID.',
  })
  @Post(':id/sync')
  syncOrder(@Param('id') id: string) {
    return this.ordersService.syncOrder(id);
  }

  @ApiOperation({ summary: 'Place a new order' })
  @ApiResponse({ status: 201, description: 'Places a new order.' })
  @Post()
  placeOrder(@Body() order: any, @Request() req: AuthRequest) {
    const userId = req.user['sub'];
    return this.ordersService.newOrder(userId, order);
  }

  @ApiOperation({ summary: 'Cancel order by IDs' })
  @ApiResponse({
    status: 200,
    description: 'Cancels the order with the given IDs.',
  })
  @Delete(':symbol/:orderId')
  cancelOrder(
    @Param('symbol') symbol: string,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.cancelOrder(symbol, orderId);
  }
}
