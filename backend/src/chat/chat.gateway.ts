import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinLesson')
  async handleJoinLesson(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lessonId: string; userId: string },
  ) {
    // Join the lesson room
    client.join(`lesson-${data.lessonId}`);
    
    // Notify other users in the room
    client.to(`lesson-${data.lessonId}`).emit('userJoined', {
      userId: data.userId,
      lessonId: data.lessonId,
    });
  }

  @SubscribeMessage('leaveLesson')
  async handleLeaveLesson(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lessonId: string; userId: string },
  ) {
    // Leave the lesson room
    client.leave(`lesson-${data.lessonId}`);
    
    // Notify other users in the room
    client.to(`lesson-${data.lessonId}`).emit('userLeft', {
      userId: data.userId,
      lessonId: data.lessonId,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { 
      lessonId: string; 
      userId: string; 
      content: string;
      timecode?: number;
      parentId?: string;
    },
  ) {
    try {
      // Create the message in the database
      const message = await this.chatService.createMessage({
        content: data.content,
        userId: data.userId,
        lessonId: data.lessonId,
        timecode: data.timecode,
        parentId: data.parentId,
      });
      
      // Broadcast the message to all clients in the lesson room
      this.server.to(`lesson-${data.lessonId}`).emit('newMessage', message);
      
      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lessonId: string },
  ) {
    try {
      const messages = await this.chatService.getMessagesByLesson(data.lessonId);
      client.emit('messages', messages);
      return { success: true, messages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
