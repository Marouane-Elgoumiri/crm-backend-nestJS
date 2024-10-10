import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

@Injectable()
export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const corsOptions = {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    };
    const optionsWithCors: ServerOptions = {
      ...options,
      cors: corsOptions,
    };
    const server = super.createIOServer(port, optionsWithCors);
    return server;
  }
}