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
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(
      req.user.sub,
      updateProfileDto,
    );

    return {
      success: true,
      message: 'Profile updated successfully / تم تحديث الملف الشخصي بنجاح',
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
  async getAllUsers(@Query() getUsersDto: GetUsersDto) {
    const result = await this.usersService.getAllUsers(getUsersDto);

    return {
      success: true,
      message: 'Users retrieved successfully / تم استرجاع المستخدمين بنجاح',
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
