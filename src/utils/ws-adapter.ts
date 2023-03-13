import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from 'winston';
import { AuthService } from 'src/auth/auth.service';
const WS_PORT: string = process.env.WS_PORT;

@WebSocketGateway({ cors: { origin: '*' } })
export class WsAdapter {
  constructor(private readonly authService: AuthService) {}
  @Inject('winston') logger: Logger;
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket, message: string) {
    try {
      console.log('conectado');
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      // const user: UserI = await this.userService.getOne(decodedToken.user.id);
      // if (!user) {
      //     return this.disconnect(socket);
      // } else {
      //     socket.data.user = user;
      //     const rooms = await this.roomService.getRoomsForUser(user.id, { page: 1, limit: 10 });
      //     // substract page -1 to match the angular material paginator
      //     rooms.meta.currentPage = rooms.meta.currentPage - 1;
      //     // Save connection to DB
      //     await this.connectedUserService.create({ socketId: socket.id, user });
      //     // Only emit rooms to the specific connected client
      // return this.server.to(socket.id).emit('rooms', "teste");
      // }
    } catch {}
    return this.disconnect(socket);
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
