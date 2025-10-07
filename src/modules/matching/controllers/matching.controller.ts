import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MatchingService } from '../services/matching.service';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { GetRecommendationsDto } from '../dto/get-recommendations.dto';

@ApiTags('Matching')
@ApiBearerAuth()
@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update matching preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePreferences(
    @Request() req: any,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    const userId = req.user.sub;
    const preferences = await this.matchingService.updatePreferences(
      userId,
      updatePreferencesDto,
    );

    return {
      success: true,
      message: 'Matching preferences updated successfully',
      data: preferences,
    };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get current user matching preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Preferences not found' })
  async getPreferences(@Request() req: any) {
    const userId = req.user.sub;
    const preferences = await this.matchingService.getPreferences(userId);

    return {
      success: true,
      data: preferences,
    };
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get match recommendations based on preferences' })
  @ApiResponse({
    status: 200,
    description: 'Recommendations retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiQuery({
    name: 'minCompatibilityScore',
    required: false,
    type: Number,
    description: 'Minimum compatibility score (0-100)',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    enum: ['male', 'female'],
    description: 'Filter by gender',
  })
  @ApiQuery({
    name: 'maritalStatus',
    required: false,
    enum: ['single', 'divorced', 'widowed'],
    description: 'Filter by marital status',
  })
  @ApiQuery({
    name: 'minAge',
    required: false,
    type: Number,
    description: 'Minimum age filter',
  })
  @ApiQuery({
    name: 'maxAge',
    required: false,
    type: Number,
    description: 'Maximum age filter',
  })
  async getRecommendations(
    @Request() req: any,
    @Query() query: GetRecommendationsDto,
  ) {
    const userId = req.user.sub;
    const recommendations = await this.matchingService.getRecommendations(
      userId,
      query,
    );

    return {
      success: true,
      message: 'Match recommendations retrieved successfully',
      ...recommendations,
    };
  }
}
