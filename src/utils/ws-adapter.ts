import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
const WS_PORT: string = process.env.WS_PORT

@WebSocketGateway(parseInt(WS_PORT) | 8080)
export class WsAdapter {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('eventss')
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }
}