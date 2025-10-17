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
  @ApiOperation({
    summary: 'Get match recommendations based on preferences and filters',
    description: 'Get personalized match recommendations with comprehensive filtering options including location, religion, physical attributes, and marriage preferences. Supports pagination and compatibility score filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'Recommendations retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
