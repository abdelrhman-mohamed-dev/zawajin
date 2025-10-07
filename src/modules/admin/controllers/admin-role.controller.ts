import {
  Controller,
  Get,
  Post,
  Put,
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
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminRoleService } from '../services/admin-role.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminRolesDto } from '../dto/update-admin-roles.dto';

@ApiTags('Admin - Role Management')
@ApiBearerAuth()
@Controller('admin/admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class AdminRoleController {
  constructor(private readonly adminRoleService: AdminRoleService) {}

  @Get()
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all admin users (super admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Admins fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super admin only' })
  async getAllAdmins(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminRoleService.getAllAdmins(page, limit, lang);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create new admin user (super admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super admin only' })
  async createAdmin(@Body() adminData: CreateAdminDto, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const superAdminId = req.user.id;
    return this.adminRoleService.createAdmin(adminData, superAdminId, lang);
  }

  @Put(':id/roles')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update admin roles/permissions (super admin only)' })
  @ApiResponse({ status: 200, description: 'Admin roles updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super admin only' })
  async updateAdminRoles(
    @Param('id') id: string,
    @Body() rolesData: UpdateAdminRolesDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const superAdminId = req.user.id;
    return this.adminRoleService.updateAdminRoles(id, rolesData, superAdminId, lang);
  }

  @Put(':id/promote')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Promote admin to super_admin (super admin only)' })
  @ApiResponse({ status: 200, description: 'Admin promoted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super admin only' })
  async promoteToSuperAdmin(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const superAdminId = req.user.id;
    return this.adminRoleService.promoteToSuperAdmin(id, superAdminId, lang);
  }

  @Put(':id/demote')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Demote super_admin to admin (super admin only)' })
  @ApiResponse({ status: 200, description: 'Super admin demoted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot demote yourself' })
  async demoteToAdmin(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const superAdminId = req.user.id;
    return this.adminRoleService.demoteToAdmin(id, superAdminId, lang);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Remove admin privileges (super admin only)' })
  @ApiResponse({ status: 200, description: 'Admin privileges removed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot remove your own privileges' })
  async removeAdminPrivileges(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const superAdminId = req.user.id;
    return this.adminRoleService.removeAdminPrivileges(id, superAdminId, lang);
  }
}
