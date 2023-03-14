import { Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Logger } from 'winston';
const WS_PORT: string = process.env.WS_PORT;

@WebSocketGateway({ cors: { origin: '*' } })
export class WsAdapter
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly authService: AuthService) {}
  @Inject('winston') logger: Logger;
  @WebSocketServer()
  server: Server;

  onModuleInit() {}

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
