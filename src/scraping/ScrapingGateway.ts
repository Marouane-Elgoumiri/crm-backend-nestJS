import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ScrapingGateway {
  @WebSocketServer()
  server: Server;

  sendProgressUpdate(progress: number) {
    this.server.emit('progress', progress);
  }
}