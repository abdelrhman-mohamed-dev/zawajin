import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
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
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { UserStatisticsDto } from '../dto/user-statistics.dto';
import { SetUserStatusDto } from '../dto/set-user-status.dto';

@ApiTags('Users & Profiles')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto, @I18n() i18n: I18nContext) {
    const user = await this.usersService.updateProfile(
      req.user.sub,
      updateProfileDto,
    );

    return {
      success: true,
      message: await i18n.t('users.profile_updated'),
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set user online/offline status',
    description: 'Update the current user\'s online or offline status. This status is displayed to other users on the platform.',
  })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully',
    schema: {
      example: {
        success: true,
        message: 'User status updated successfully',
        data: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          isOnline: true,
          lastSeenAt: '2024-01-01T12:00:00.000Z',
          socketId: null,
        },
        timestamp: '2024-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async setUserStatus(@Request() req, @Body() setUserStatusDto: SetUserStatusDto, @I18n() i18n: I18nContext) {
    const presence = await this.usersService.setUserStatus(
      req.user.sub,
      setUserStatusDto.isOnline,
    );

    return {
      success: true,
      message: await i18n.t('users.status_updated'),
      data: presence,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest joined users with filters (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Latest users retrieved successfully',
  })
  async getLatestUsers(@I18n() i18n: I18nContext, @Query() getUsersDto: GetUsersDto) {
    const users = await this.usersService.getLatestUsers(getUsersDto);

    return {
      success: true,
      message: await i18n.t('users.users_retrieved'),
      data: users,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user statistics (Public)',
    description: 'Returns statistics about users including total male/female users and online users today. This endpoint is public and does not require authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserStatisticsDto,
    schema: {
      example: {
        success: true,
        message: 'User statistics retrieved successfully',
        data: {
          totalMaleUsers: 1250,
          totalFemaleUsers: 980,
          onlineMaleUsersToday: 45,
          onlineFemaleUsersToday: 38,
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  async getUserStatistics(@I18n() i18n: I18nContext) {
    const stats = await this.usersService.getUserStatistics();

    return {
      success: true,
      message: await i18n.t('users.statistics_retrieved'),
      data: stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Public)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') userId: string, @I18n() i18n: I18nContext) {
    const user = await this.usersService.getUserById(userId);

    return {
      success: true,
      message: await i18n.t('users.user_retrieved'),
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with filters' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(@Request() req, @Query() getUsersDto: GetUsersDto, @I18n() i18n: I18nContext) {
    const result = await this.usersService.getAllUsers(getUsersDto, req.user.sub);

    return {
      success: true,
      message: await i18n.t('users.users_retrieved'),
      data: {
        users: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
