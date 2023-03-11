import { Inject } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
import { Socket } from 'net';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from 'winston';
import { Server } from 'ws';
const WS_PORT: string = process.env.WS_PORT

@WebSocketGateway(parseInt(WS_PORT) | 8080)
export class WsAdapter {
    @Inject('winston') logger: Logger
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    handleEvent(client: Socket, data: string): string {
            console.log(data)
            return data;
    }
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }
}
