import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ContactUsService } from './contact-us.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { FilterContactMessagesDto } from './dto/filter-contact-messages.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { I18nLang } from 'nestjs-i18n';

@ApiTags('Contact Us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Submit a contact message',
    description:
      'Allows authenticated users or guests to submit contact/feedback messages. For guests, email and name are required.',
  })
  @ApiResponse({
    status: 201,
    description: 'Contact message submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Email and name are required for guest users',
  })
  async create(
    @Body() createContactMessageDto: CreateContactMessageDto,
    @Req() req: any,
    @I18nLang() lang: string,
  ) {
    const userId = req.user?.id;
    return this.contactUsService.create(
      createContactMessageDto,
      userId,
      lang,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-messages')
  @ApiOperation({
    summary: 'Get my contact messages',
    description: 'Retrieve all contact messages submitted by the current user',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'User contact messages retrieved successfully',
  })
  async findMyMessages(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contactUsService.findMyMessages(req.user.id, page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Get all contact messages (Admin)',
    description: 'Retrieve all contact messages with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact messages retrieved successfully',
  })
  async findAll(@Query() filterDto: FilterContactMessagesDto) {
    return this.contactUsService.findAll(filterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Get('statistics')
  @ApiOperation({
    summary: 'Get contact messages statistics (Admin)',
    description: 'Retrieve statistics about contact messages',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    return this.contactUsService.getStatistics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Get a contact message by ID (Admin)',
    description: 'Retrieve a specific contact message',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact message retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Contact message not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    return this.contactUsService.findOne(id, lang);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a contact message (Admin)',
    description: 'Update status, priority, assignment, or add admin response',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact message updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Contact message or admin not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactMessageDto: UpdateContactMessageDto,
    @Req() req: any,
    @I18nLang() lang: string,
  ) {
    return this.contactUsService.update(
      id,
      updateContactMessageDto,
      req.user.id,
      lang,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a contact message (Admin)',
    description: 'Permanently delete a contact message',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact message deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Contact message not found',
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    await this.contactUsService.delete(id, lang);
    return { message: 'Contact message deleted successfully' };
  }
}
