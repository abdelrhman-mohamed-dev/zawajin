import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InteractionsService } from '../services/interactions.service';
import { UsersService } from '../../users/services/users.service';

@ApiTags('User Interactions')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InteractionsController {
  constructor(
    private readonly interactionsService: InteractionsService,
    private readonly usersService: UsersService,
  ) {}

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like a user' })
  @ApiParam({ name: 'id', description: 'User ID to like' })
  @ApiResponse({
    status: 200,
    description: 'Like sent successfully',
    schema: {
      example: {
        success: true,
        message: 'Like sent successfully',
        data: {
          isMatch: false,
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'It\'s a match!',
    schema: {
      example: {
        success: true,
        message: 'It\'s a match!',
        data: {
          isMatch: true,
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already liked this user' })
  async likeUser(@Request() req, @Param('id') likedUserId: string) {
    const result = await this.interactionsService.likeUser(req.user.sub, likedUserId);

    return {
      success: true,
      message: result.message,
      data: {
        isMatch: result.isMatch,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlike a user' })
  @ApiParam({ name: 'id', description: 'User ID to unlike' })
  @ApiResponse({
    status: 200,
    description: 'Unlike successful',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  async unlikeUser(@Request() req, @Param('id') likedUserId: string) {
    await this.interactionsService.unlikeUser(req.user.sub, likedUserId);

    return {
      success: true,
      message: 'Unlike successful / تم إلغاء الإعجاب بنجاح',
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({ name: 'id', description: 'User ID to block' })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          example: 'Inappropriate behavior',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User blocked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Already blocked this user' })
  async blockUser(
    @Request() req,
    @Param('id') blockedUserId: string,
    @Body() body?: { reason?: string },
  ) {
    await this.interactionsService.blockUser(req.user.sub, blockedUserId, body?.reason);

    return {
      success: true,
      message: 'User blocked successfully / تم حظر المستخدم بنجاح',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({ name: 'id', description: 'User ID to unblock' })
  @ApiResponse({
    status: 200,
    description: 'User unblocked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Block not found' })
  async unblockUser(@Request() req, @Param('id') blockedUserId: string) {
    await this.interactionsService.unblockUser(req.user.sub, blockedUserId);

    return {
      success: true,
      message: 'User unblocked successfully / تم إلغاء حظر المستخدم بنجاح',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('likes/sent')
  @ApiOperation({ summary: 'Get likes sent by current user' })
  @ApiResponse({
    status: 200,
    description: 'Likes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLikesSent(@Request() req) {
    const likes = await this.interactionsService.getLikesSent(req.user.sub);

    return {
      success: true,
      message: 'Likes retrieved successfully / تم استرجاع الإعجابات بنجاح',
      data: {
        likes,
        total: likes.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('likes/received')
  @ApiOperation({ summary: 'Get likes received by current user' })
  @ApiResponse({
    status: 200,
    description: 'Likes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLikesReceived(@Request() req) {
    const likes = await this.interactionsService.getLikesReceived(req.user.sub);

    return {
      success: true,
      message: 'Likes retrieved successfully / تم استرجاع الإعجابات بنجاح',
      data: {
        likes,
        total: likes.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('blocks')
  @ApiOperation({ summary: 'Get blocked users' })
  @ApiResponse({
    status: 200,
    description: 'Blocked users retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBlockedUsers(@Request() req) {
    const blocks = await this.interactionsService.getBlockedUsers(req.user.sub);

    return {
      success: true,
      message: 'Blocked users retrieved successfully / تم استرجاع المستخدمين المحظورين بنجاح',
      data: {
        blocks,
        total: blocks.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '615c8a9b4f7d4e3e4c8b4567',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);

    return {
      success: true,
      message: 'User retrieved successfully / تم استرجاع المستخدم بنجاح',
      data: user,
      timestamp: new Date().toISOString(),
    };
  }
}
