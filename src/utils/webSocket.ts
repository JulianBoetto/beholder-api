import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Logger } from 'winston';
import { WebsocketClient } from 'binance';
import { Setting } from 'src/settings/entities/setting.entity';

const WS_PORT: string = process.env.WS_PORT;

@WebSocketGateway({ cors: { origin: '*' } })
export class WsAdapter {
  constructor(private readonly authService: AuthService) {}
  // @Inject('winston') logger: Logger;
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket, message: string) {
    try {
      console.log('conectado');
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      return socket;
    } catch {}
    return this.disconnect(socket);
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: string) {
    console.log(message);

    // this.server.to(socket.id).emit('messageAdded', `${message}`);
  }
}

export const BinanceWS = (settings: Setting, callback) => {
  const wsClient = new WebsocketClient({
    api_key: settings.accessKey,
    api_secret: settings.secretKey,
    restOptions: {
      baseUrl: settings.apiUrl
    },
    wsUrl: settings.streamUrl,
    beautify: true,
  });

  // receive raw events
  wsClient.on('message', (data) => {
    // console.log('raw message received ', JSON.stringify(data, null, 2));
    // callback(data);
  });

  // notification when a connection is opened
  wsClient.on('open', (data: { wsKey: string; ws: any }) => {
    console.log('connection opened open:', data.wsKey, data.ws.target.url);
  });

  wsClient.on('formattedMessage', (data) => {
    // console.log('formattedMessage: ', data);
    callback(data)
  });

  wsClient.on('reply', (data) => {
    console.log('log reply: ', JSON.stringify(data, null, 2));
  });

  wsClient.on('reconnecting', (data) => {
    console.log('ws automatically reconnecting.... ', data?.wsKey);
  });

  wsClient.on('reconnected', (data) => {
    console.log('ws has reconnected ', data?.wsKey);
  });

  wsClient.on('error', (data) => {
    console.log('ws saw error ', data?.wsKey);
  });

  return wsClient;
};
