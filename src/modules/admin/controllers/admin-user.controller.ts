import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminUserService } from '../services/admin-user.service';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';

@ApiTags('Admin - User Management')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin', 'super_admin')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all users with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'isBanned', required: false, type: Boolean })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isBanned') isBanned?: boolean,
    @Query('isVerified') isVerified?: boolean,
  ) {
    return this.adminUserService.getAllUsers(
      page,
      limit,
      search,
      role,
      isBanned,
      isVerified,
    );
  }

  @Get(':id')
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get detailed user info' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserById(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminUserService.getUserById(id, lang);
  }

  @Put(':id')
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update user profile (admin override)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserAdminDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminUserService.updateUser(id, updateData, adminId, lang);
  }

  @Post(':id/ban')
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Ban user (temporary or permanent)' })
  @ApiResponse({ status: 200, description: 'User banned successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User already banned' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async banUser(
    @Param('id') id: string,
    @Body() banData: BanUserDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminUserService.banUser(id, banData, adminId, lang);
  }

  @Post(':id/unban')
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Unban user' })
  @ApiResponse({ status: 200, description: 'User unbanned successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User not banned' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async unbanUser(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminUserService.unbanUser(id, adminId, lang);
  }

  @Delete(':id')
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Disable/delete user account (soft delete)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminUserService.deleteUser(id, adminId, lang);
  }

  @Post(':id/verify')
  @RequirePermissions('verify_users')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Manually verify user profile' })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User already verified' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async verifyUser(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminUserService.verifyUser(id, adminId, lang);
  }

  @Post(':id/send-notification')
  @RequirePermissions('send_notifications')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Send notification to user' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async sendNotification(
    @Param('id') id: string,
    @Body() notificationData: SendNotificationDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminUserService.sendNotificationToUser(
      id,
      notificationData,
      adminId,
      lang,
    );
  }

  @Post(':id/send-email')
  @RequirePermissions('send_notifications')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Send email to user' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async sendEmail(
    @Param('id') id: string,
    @Body() notificationData: SendNotificationDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    // Use the same method with email type
    return this.adminUserService.sendNotificationToUser(
      id,
      { ...notificationData, notificationType: 'email' },
      adminId,
      lang,
    );
  }

  @Get(':id/activity-logs')
  @RequirePermissions('manage_users')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Activity logs fetched successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserActivityLogs(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminUserService.getUserActivityLogs(id, page, limit, lang);
  }
}
