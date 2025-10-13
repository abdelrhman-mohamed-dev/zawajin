import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ChatController } from './controllers/chat.controller';
import { UploadController } from './controllers/upload.controller';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { UserPresence } from './entities/user-presence.entity';
import { EngagementRequest } from './entities/engagement-request.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { UserPresenceRepository } from './repositories/user-presence.repository';
import { EngagementRequestRepository } from './repositories/engagement-request.repository';
import { Like } from '../interactions/entities/like.entity';
import { Block } from '../interactions/entities/block.entity';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Message,
      UserPresence,
      EngagementRequest,
      Like,
      Block,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ChatController, UploadController],
  providers: [
    ChatService,
    ChatGateway,
    ConversationRepository,
    MessageRepository,
    UserPresenceRepository,
    EngagementRequestRepository,
    WsJwtGuard,
  ],
  exports: [ChatService],
})
export class ChatModule {}
