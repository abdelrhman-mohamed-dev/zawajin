import { Repository } from 'typeorm';
import { MatchingPreferences } from '../entities/matching-preferences.entity';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
export declare class MatchingPreferencesRepository {
    private readonly repository;
    constructor(repository: Repository<MatchingPreferences>);
    findByUserId(userId: string): Promise<MatchingPreferences | null>;
    createOrUpdate(userId: string, data: UpdatePreferencesDto): Promise<MatchingPreferences>;
    delete(userId: string): Promise<void>;
}
