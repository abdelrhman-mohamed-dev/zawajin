import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ChatService } from '../services/chat.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 conversations per minute
  @ApiOperation({ summary: 'Create a new conversation with a matched user' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  @ApiResponse({ status: 403, description: 'Users are not matched or blocked' })
  async createConversation(
    @Request() req,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(
      req.user.userId,
      createConversationDto,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of conversations retrieved successfully',
  })
  async getUserConversations(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.chatService.getUserConversations(
      req.user.userId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation details by ID' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Not a participant in this conversation' })
  async getConversationById(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.getConversationById(req.user.userId, id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get message history for a conversation (paginated)' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationMessages(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.chatService.getConversationMessages(
      req.user.userId,
      id,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Post('conversations/:id/messages')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 messages per minute
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Cannot send message to blocked user' })
  async sendMessage(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(req.user.userId, id, sendMessageDto);
  }

  @Put('conversations/:id/read')
  @ApiOperation({ summary: 'Mark all messages in conversation as read' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async markMessagesAsRead(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.chatService.markMessagesAsRead(req.user.userId, id);
    return {
      message: 'Messages marked as read',
      messageAr: 'تم وضع علامة مقروءة على الرسائل',
    };
  }

  @Delete('messages/:id')
  @ApiOperation({ summary: 'Delete a message (soft delete)' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Can only delete own messages' })
  async deleteMessage(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.chatService.deleteMessage(req.user.userId, id);
    return {
      message: 'Message deleted successfully',
      messageAr: 'تم حذف الرسالة بنجاح',
    };
  }

  @Get('conversations/:id/unread-count')
  @ApiOperation({ summary: 'Get unread message count for a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const count = await this.chatService.getUnreadCount(req.user.userId, id);
    return { count };
  }
}
