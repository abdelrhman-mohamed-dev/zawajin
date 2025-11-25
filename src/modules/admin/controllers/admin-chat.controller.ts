import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminChatService } from '../services/admin-chat.service';
import { AdminChatFilterDto } from '../dto/admin-chat-filter.dto';
import { AdminCloseConversationDto } from '../dto/admin-close-conversation.dto';
import { AdminDeleteMessageDto } from '../dto/admin-delete-message.dto';

@ApiTags('Admin - Chat Management')
@ApiBearerAuth()
@Controller('admin/chats')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin', 'super_admin', 'moderator')
export class AdminChatController {
  constructor(private readonly adminChatService: AdminChatService) {}

  @Get('conversations')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Get all conversations with advanced filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by participant name or email' })
  @ApiQuery({ name: 'status', required: false, enum: ['all', 'reported', 'active', 'closed'] })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-12-31' })
  @ApiQuery({ name: 'hasReports', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Conversations fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllConversations(
    @Query() filters: AdminChatFilterDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminChatService.getAllConversations(filters, lang);
  }

  @Get('conversations/reported')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Get all reported conversations' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Reported conversations fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getReportedConversations(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminChatService.getReportedConversations(page, limit, lang);
  }

  @Get('conversations/:id')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Get detailed conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation fetched successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getConversationById(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminChatService.getConversationById(id, lang);
  }

  @Get('conversations/:id/messages')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Get all messages from a conversation' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Messages fetched successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getConversationMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminChatService.getConversationMessages(id, page, limit, lang);
  }

  @Delete('messages/:id')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Delete a specific message (admin override)' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteMessage(
    @Param('id') messageId: string,
    @Body() deleteDto: AdminDeleteMessageDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminChatService.deleteMessage(messageId, adminId, deleteDto, lang);
  }

  @Delete('conversations/:id')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Close/delete a conversation (admin override)' })
  @ApiResponse({ status: 200, description: 'Conversation closed successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async closeConversation(
    @Param('id') conversationId: string,
    @Body() closeDto: AdminCloseConversationDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminChatService.closeConversation(conversationId, adminId, closeDto, lang);
  }

  @Get('statistics')
  @RequirePermissions('view_analytics')
  @ApiOperation({ summary: 'Get chat statistics (overview)' })
  @ApiResponse({ status: 200, description: 'Statistics fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getChatStatistics(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminChatService.getChatStatistics(lang);
  }

  @Get('messages/search')
  @RequirePermissions('manage_chats')
  @ApiOperation({ summary: 'Search messages across all conversations' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Messages fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async searchMessages(
    @Query('q') searchQuery: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminChatService.searchMessages(searchQuery, page, limit, lang);
  }
}
