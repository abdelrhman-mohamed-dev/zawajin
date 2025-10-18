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
import { SendEngagementDto } from '../dto/send-engagement.dto';
import { RespondEngagementDto } from '../dto/respond-engagement.dto';
import { PaginationDto } from '../dto/pagination.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
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

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete all messages in a conversation (clears chat history)' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'All messages deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Not a participant in this conversation' })
  async deleteConversation(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.chatService.deleteConversation(req.user.userId, id);
    return {
      message: 'All messages deleted successfully',
      messageAr: 'تم حذف جميع الرسائل بنجاح',
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

  @Get('users/:userId/presence')
  @ApiOperation({ summary: 'Get user online/offline status' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User presence retrieved successfully',
  })
  async getUserPresence(
    @Request() req,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.chatService.getUserPresence(userId);
  }

  // ======================== ENGAGEMENT ROUTES ========================

  @Post('engagement-requests')
  @ApiOperation({ summary: 'Send an engagement request to a user' })
  @ApiResponse({
    status: 201,
    description: 'Engagement request sent successfully',
  })
  @ApiResponse({ status: 403, description: 'Cannot send engagement request to blocked user' })
  @ApiResponse({ status: 409, description: 'Engagement request already exists' })
  async sendEngagementRequest(
    @Request() req,
    @Body() sendEngagementDto: SendEngagementDto,
  ) {
    return this.chatService.sendEngagementRequest(
      req.user.userId,
      sendEngagementDto,
    );
  }

  @Put('engagement-requests/:id/respond')
  @ApiOperation({ summary: 'Accept or refuse an engagement request' })
  @ApiParam({ name: 'id', description: 'Engagement request ID' })
  @ApiResponse({
    status: 200,
    description: 'Engagement request responded successfully',
  })
  @ApiResponse({ status: 404, description: 'Engagement request not found' })
  @ApiResponse({ status: 403, description: 'Only recipient can respond' })
  async respondToEngagementRequest(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() respondDto: RespondEngagementDto,
  ) {
    return this.chatService.respondToEngagementRequest(
      req.user.userId,
      id,
      respondDto,
    );
  }

  @Delete('engagement-requests/:id')
  @ApiOperation({ summary: 'Cancel an engagement request (sender only)' })
  @ApiParam({ name: 'id', description: 'Engagement request ID' })
  @ApiResponse({
    status: 200,
    description: 'Engagement request cancelled successfully',
  })
  @ApiResponse({ status: 404, description: 'Engagement request not found' })
  @ApiResponse({ status: 403, description: 'Only sender can cancel' })
  async cancelEngagementRequest(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.chatService.cancelEngagementRequest(req.user.userId, id);
    return {
      message: 'Engagement request cancelled successfully',
      messageAr: 'تم إلغاء طلب الخطوبة بنجاح',
    };
  }

  @Get('engagement-requests/sent')
  @ApiOperation({ summary: 'Get all engagement requests sent by current user' })
  @ApiResponse({
    status: 200,
    description: 'Sent engagement requests retrieved successfully',
  })
  async getSentEngagementRequests(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.chatService.getSentEngagementRequests(
      req.user.userId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('engagement-requests/received')
  @ApiOperation({ summary: 'Get all engagement requests received by current user' })
  @ApiResponse({
    status: 200,
    description: 'Received engagement requests retrieved successfully',
  })
  async getReceivedEngagementRequests(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.chatService.getReceivedEngagementRequests(
      req.user.userId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('engagement-requests/pending')
  @ApiOperation({ summary: 'Get all pending engagement requests received by current user' })
  @ApiResponse({
    status: 200,
    description: 'Pending engagement requests retrieved successfully',
  })
  async getPendingEngagementRequests(@Request() req) {
    return this.chatService.getPendingEngagementRequests(req.user.userId);
  }

  @Get('engagement-requests/pending/count')
  @ApiOperation({ summary: 'Get count of pending engagement requests' })
  @ApiResponse({
    status: 200,
    description: 'Pending engagement count retrieved successfully',
  })
  async getPendingEngagementCount(@Request() req) {
    const count = await this.chatService.getPendingEngagementCount(req.user.userId);
    return { count };
  }

  @Get('engagement-requests/:id')
  @ApiOperation({ summary: 'Get engagement request details by ID' })
  @ApiParam({ name: 'id', description: 'Engagement request ID' })
  @ApiResponse({
    status: 200,
    description: 'Engagement request details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Engagement request not found' })
  async getEngagementRequestById(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.getEngagementRequestById(req.user.userId, id);
  }

  @Get('conversations/:id/engagement-requests')
  @ApiOperation({ summary: 'Get all engagement requests for a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation engagement requests retrieved successfully',
  })
  async getConversationEngagementRequests(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.getConversationEngagementRequests(
      req.user.userId,
      id,
    );
  }
}
