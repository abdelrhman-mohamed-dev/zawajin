import { MatchingService } from '../services/matching.service';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { GetRecommendationsDto } from '../dto/get-recommendations.dto';
export declare class MatchingController {
    private readonly matchingService;
    constructor(matchingService: MatchingService);
    updatePreferences(req: any, updatePreferencesDto: UpdatePreferencesDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/matching-preferences.entity").MatchingPreferences;
    }>;
    getPreferences(req: any): Promise<{
        success: boolean;
        data: import("../entities/matching-preferences.entity").MatchingPreferences;
    }>;
    getRecommendations(req: any, query: GetRecommendationsDto): Promise<{
        data: import("../interfaces/matching.interface").IMatchRecommendation[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        success: boolean;
        message: string;
    }>;
}
