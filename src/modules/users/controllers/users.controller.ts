import {
  Controller,
  Get,
  Put,
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

  @Get('latest')
  @ApiOperation({ summary: 'Get latest joined users (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Latest users retrieved successfully',
  })
  async getLatestUsers(@I18n() i18n: I18nContext, @Query('limit') limit?: number) {
    const users = await this.usersService.getLatestUsers(limit || 10);

    return {
      success: true,
      message: await i18n.t('users.users_retrieved'),
      data: users,
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
