import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { MatchingPreferences } from '../entities/matching-preferences.entity';
import { MatchingPreferencesRepository } from '../repositories/matching-preferences.repository';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { GetRecommendationsDto } from '../dto/get-recommendations.dto';
import { IRecommendationsResponse } from '../interfaces/matching.interface';
import { Like } from '../../interactions/entities/like.entity';
export declare class MatchingService {
    private readonly userRepository;
    private readonly likeRepository;
    private readonly preferencesRepository;
    constructor(userRepository: Repository<User>, likeRepository: Repository<Like>, preferencesRepository: MatchingPreferencesRepository);
    private sanitizeNumericFields;
    updatePreferences(userId: string, data: UpdatePreferencesDto): Promise<MatchingPreferences>;
    getPreferences(userId: string): Promise<MatchingPreferences>;
    getRecommendations(userId: string, query: GetRecommendationsDto): Promise<IRecommendationsResponse>;
    private calculateCompatibilityScore;
    private calculateAgeScore;
    private calculateLocationScore;
    private calculateReligiousScore;
    private calculateMaritalStatusScore;
    private calculateProfessionScore;
    private calculatePhysicalAttributesScore;
    private calculateMarriageTypeScore;
}
