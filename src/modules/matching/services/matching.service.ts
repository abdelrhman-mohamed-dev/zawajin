import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { MatchingPreferences } from '../entities/matching-preferences.entity';
import { MatchingPreferencesRepository } from '../repositories/matching-preferences.repository';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { GetRecommendationsDto } from '../dto/get-recommendations.dto';
import {
  IMatchRecommendation,
  IRecommendationsResponse,
  ICompatibilityScore,
} from '../interfaces/matching.interface';
import { Like } from '../../interactions/entities/like.entity';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly preferencesRepository: MatchingPreferencesRepository,
  ) {}

  async updatePreferences(
    userId: string,
    data: UpdatePreferencesDto,
  ): Promise<MatchingPreferences> {
    return await this.preferencesRepository.createOrUpdate(userId, data);
  }

  async getPreferences(userId: string): Promise<MatchingPreferences> {
    const preferences = await this.preferencesRepository.findByUserId(userId);

    if (!preferences) {
      throw new NotFoundException('Matching preferences not found');
    }

    return preferences;
  }

  async getRecommendations(
    userId: string,
    query: GetRecommendationsDto,
  ): Promise<IRecommendationsResponse> {
    const { page = 1, limit = 10, minCompatibilityScore, gender, maritalStatus, minAge, maxAge } = query;
    const skip = (page - 1) * limit;

    // Get current user and their preferences
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const preferences = await this.preferencesRepository.findByUserId(userId);

    // Build query to find potential matches
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.isBanned = :isBanned', { isBanned: false })
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified: true });

    // Apply basic filters
    if (preferences?.lookingForGender || gender) {
      const targetGender = gender || preferences?.lookingForGender;
      queryBuilder.andWhere('user.gender = :gender', { gender: targetGender });
    }

    if (preferences?.minAge || minAge) {
      const ageMin = minAge || preferences?.minAge;
      queryBuilder.andWhere('user.age >= :minAge', { minAge: ageMin });
    }

    if (preferences?.maxAge || maxAge) {
      const ageMax = maxAge || preferences?.maxAge;
      queryBuilder.andWhere('user.age <= :maxAge', { maxAge: ageMax });
    }

    if (preferences?.preferredMaritalStatuses?.length > 0 || maritalStatus) {
      const statuses = maritalStatus ? [maritalStatus] : preferences.preferredMaritalStatuses;
      queryBuilder.andWhere('user.maritalStatus IN (:...statuses)', { statuses });
    }

    if (preferences?.preferredReligiousPractices?.length > 0) {
      queryBuilder.andWhere('user.religiousPractice IN (:...practices)', {
        practices: preferences.preferredReligiousPractices,
      });
    }

    if (preferences?.preferredSects?.length > 0) {
      queryBuilder.andWhere('user.sect IN (:...sects)', {
        sects: preferences.preferredSects,
      });
    }

    if (preferences?.preferredCity) {
      queryBuilder.andWhere("user.location->>'city' = :city", {
        city: preferences.preferredCity,
      });
    }

    if (preferences?.preferredCountry) {
      queryBuilder.andWhere("user.location->>'country' = :country", {
        country: preferences.preferredCountry,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get users
    const users = await queryBuilder
      .skip(skip)
      .take(limit * 2) // Get more to filter by compatibility score
      .getMany();

    // Get all likes for the current user in a single query
    const userLikes = await this.likeRepository.find({
      where: { userId },
      select: ['likedUserId'],
    });
    const likedUserIds = new Set(userLikes.map(like => like.likedUserId));

    // Calculate compatibility scores for each user
    const recommendations: IMatchRecommendation[] = users
      .map((user) => {
        const compatibility = this.calculateCompatibilityScore(
          currentUser,
          user,
          preferences,
        );

        return {
          userId: user.id,
          fullName: user.fullName,
          age: user.age,
          gender: user.gender,
          location: user.location,
          origin: user.origin,
          bio: user.bio,
          religiousPractice: user.religiousPractice,
          sect: user.sect,
          prayerLevel: user.prayerLevel,
          maritalStatus: user.maritalStatus,
          profession: user.profession,
          // Physical attributes
          weight: user.weight,
          height: user.height,
          bodyColor: user.bodyColor,
          hairColor: user.hairColor,
          hairType: user.hairType,
          eyeColor: user.eyeColor,
          // Work and housing
          houseAvailable: user.houseAvailable,
          natureOfWork: user.natureOfWork,
          // Marriage preferences
          marriageType: user.marriageType,
          acceptPolygamy: user.acceptPolygamy,
          compatibilityScore: compatibility.totalScore,
          scoreBreakdown: compatibility.breakdown,
          hasLiked: likedUserIds.has(user.id),
        };
      })
      .filter((rec) => {
        // Filter by minimum compatibility score if provided
        if (minCompatibilityScore) {
          return rec.compatibilityScore >= minCompatibilityScore;
        }
        return true;
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore) // Sort by score descending
      .slice(0, limit); // Take only requested limit

    return {
      data: recommendations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private calculateCompatibilityScore(
    currentUser: User,
    targetUser: User,
    preferences: MatchingPreferences | null,
  ): ICompatibilityScore {
    // Default weights if no preferences set
    const weights = {
      age: preferences?.ageImportance || 5,
      location: preferences?.locationImportance || 5,
      religious: preferences?.religiousImportance || 8,
      maritalStatus: preferences?.maritalStatusImportance || 5,
      profession: preferences?.professionImportance || 3,
      physicalAttributes: preferences?.physicalAttributesImportance || 5,
      marriageType: preferences?.marriageTypeImportance || 7,
    };

    // Calculate total weight
    const totalWeight =
      weights.age +
      weights.location +
      weights.religious +
      weights.maritalStatus +
      weights.profession +
      weights.physicalAttributes +
      weights.marriageType;

    // Calculate individual scores (0-100)
    const ageScore = this.calculateAgeScore(
      currentUser.age,
      targetUser.age,
      preferences,
    );
    const locationScore = this.calculateLocationScore(
      currentUser.location,
      targetUser.location,
    );
    const religiousScore = this.calculateReligiousScore(
      targetUser.religiousPractice,
      targetUser.sect,
      targetUser.prayerLevel,
      preferences,
    );
    const maritalStatusScore = this.calculateMaritalStatusScore(
      targetUser.maritalStatus,
      preferences,
    );
    const professionScore = this.calculateProfessionScore(
      targetUser.profession,
      preferences,
    );
    const physicalAttributesScore = this.calculatePhysicalAttributesScore(
      currentUser,
      targetUser,
      preferences,
    );
    const marriageTypeScore = this.calculateMarriageTypeScore(
      currentUser,
      targetUser,
      preferences,
    );

    // Calculate weighted total score
    const totalScore = Math.round(
      (ageScore * weights.age +
        locationScore * weights.location +
        religiousScore * weights.religious +
        maritalStatusScore * weights.maritalStatus +
        professionScore * weights.profession +
        physicalAttributesScore * weights.physicalAttributes +
        marriageTypeScore * weights.marriageType) /
        totalWeight,
    );

    return {
      totalScore,
      breakdown: {
        ageScore: Math.round(ageScore),
        locationScore: Math.round(locationScore),
        religiousScore: Math.round(religiousScore),
        maritalStatusScore: Math.round(maritalStatusScore),
        professionScore: Math.round(professionScore),
        physicalAttributesScore: Math.round(physicalAttributesScore),
        marriageTypeScore: Math.round(marriageTypeScore),
      },
    };
  }

  private calculateAgeScore(
    currentAge: number,
    targetAge: number,
    preferences: MatchingPreferences | null,
  ): number {
    if (!currentAge || !targetAge) return 50; // Neutral score if age not set

    // If preferences are set, check if within range
    if (preferences?.minAge && targetAge < preferences.minAge) return 0;
    if (preferences?.maxAge && targetAge > preferences.maxAge) return 0;

    // Calculate score based on age difference
    const ageDiff = Math.abs(currentAge - targetAge);

    if (ageDiff === 0) return 100;
    if (ageDiff <= 2) return 90;
    if (ageDiff <= 5) return 75;
    if (ageDiff <= 8) return 60;
    if (ageDiff <= 10) return 40;
    return 20;
  }

  private calculateLocationScore(
    currentLocation: { city: string; country: string },
    targetLocation: { city: string; country: string },
  ): number {
    if (!currentLocation || !targetLocation) return 50; // Neutral score

    const sameCity = currentLocation.city === targetLocation.city;
    const sameCountry = currentLocation.country === targetLocation.country;

    if (sameCity && sameCountry) return 100;
    if (sameCountry) return 70;
    return 30; // Different country
  }

  private calculateReligiousScore(
    religiousPractice: string,
    sect: string,
    prayerLevel: string,
    preferences: MatchingPreferences | null,
  ): number {
    let score = 50; // Base score

    // Check religious practice
    if (preferences?.preferredReligiousPractices?.length > 0) {
      if (preferences.preferredReligiousPractices.includes(religiousPractice)) {
        score += 30;
      } else {
        score -= 20;
      }
    }

    // Check sect
    if (preferences?.preferredSects?.length > 0) {
      if (preferences.preferredSects.includes(sect)) {
        score += 10;
      } else {
        score -= 10;
      }
    }

    // Check prayer level
    if (preferences?.preferredPrayerLevels?.length > 0) {
      if (preferences.preferredPrayerLevels.includes(prayerLevel)) {
        score += 10;
      } else {
        score -= 5;
      }
    }

    return Math.max(0, Math.min(100, score)); // Clamp between 0-100
  }

  private calculateMaritalStatusScore(
    maritalStatus: string,
    preferences: MatchingPreferences | null,
  ): number {
    if (!maritalStatus) return 50;

    if (preferences?.preferredMaritalStatuses?.length > 0) {
      return preferences.preferredMaritalStatuses.includes(maritalStatus)
        ? 100
        : 0;
    }

    return 50; // Neutral if no preference
  }

  private calculateProfessionScore(
    profession: string,
    preferences: MatchingPreferences | null,
  ): number {
    if (!profession) return 50;

    if (preferences?.preferredProfessions?.length > 0) {
      return preferences.preferredProfessions.includes(profession) ? 100 : 30;
    }

    return 50; // Neutral if no preference
  }

  private calculatePhysicalAttributesScore(
    currentUser: User,
    targetUser: User,
    preferences: MatchingPreferences | null,
  ): number {
    let score = 50; // Base score
    let criteriaCount = 0;
    let matchedCriteria = 0;

    // Use MatchingPreferences first, fallback to User entity preferences
    const minHeight = preferences?.preferredMinHeight || currentUser.preferredMinHeight;
    const maxHeight = preferences?.preferredMaxHeight || currentUser.preferredMaxHeight;
    const minWeight = preferences?.preferredMinWeight || currentUser.preferredMinWeight;
    const maxWeight = preferences?.preferredMaxWeight || currentUser.preferredMaxWeight;
    const bodyColors = preferences?.preferredBodyColors || currentUser.preferredBodyColors;
    const hairColors = preferences?.preferredHairColors || currentUser.preferredHairColors;
    const eyeColors = preferences?.preferredEyeColors || currentUser.preferredEyeColors;

    // Check height preference
    if (minHeight || maxHeight) {
      criteriaCount++;
      if (targetUser.height) {
        const meetsMinHeight = !minHeight || targetUser.height >= minHeight;
        const meetsMaxHeight = !maxHeight || targetUser.height <= maxHeight;
        if (meetsMinHeight && meetsMaxHeight) {
          matchedCriteria++;
        }
      }
    }

    // Check weight preference
    if (minWeight || maxWeight) {
      criteriaCount++;
      if (targetUser.weight) {
        const meetsMinWeight = !minWeight || targetUser.weight >= minWeight;
        const meetsMaxWeight = !maxWeight || targetUser.weight <= maxWeight;
        if (meetsMinWeight && meetsMaxWeight) {
          matchedCriteria++;
        }
      }
    }

    // Check body color preference
    if (bodyColors?.length > 0) {
      criteriaCount++;
      if (targetUser.bodyColor && bodyColors.includes(targetUser.bodyColor)) {
        matchedCriteria++;
      }
    }

    // Check hair color preference
    if (hairColors?.length > 0) {
      criteriaCount++;
      if (targetUser.hairColor && hairColors.includes(targetUser.hairColor)) {
        matchedCriteria++;
      }
    }

    // Check eye color preference
    if (eyeColors?.length > 0) {
      criteriaCount++;
      if (targetUser.eyeColor && eyeColors.includes(targetUser.eyeColor)) {
        matchedCriteria++;
      }
    }

    // Calculate score based on matched criteria
    if (criteriaCount > 0) {
      score = (matchedCriteria / criteriaCount) * 100;
    }

    return Math.max(0, Math.min(100, score)); // Clamp between 0-100
  }

  private calculateMarriageTypeScore(
    currentUser: User,
    targetUser: User,
    preferences: MatchingPreferences | null,
  ): number {
    let score = 50; // Base score

    // Use MatchingPreferences first, fallback to User entity preferences
    const preferredMarriageTypes = preferences?.preferredMarriageTypes;
    const acceptPolygamy = preferences?.acceptPolygamy !== undefined
      ? preferences.acceptPolygamy
      : currentUser.acceptPolygamy;
    const requireHouse = preferences?.requireHouse;

    // Check marriage type preference
    if (preferredMarriageTypes?.length > 0) {
      if (targetUser.marriageType && preferredMarriageTypes.includes(targetUser.marriageType)) {
        score += 20;
      } else if (targetUser.marriageType) {
        score -= 15;
      }
    }

    // Check polygamy compatibility
    if (acceptPolygamy !== undefined && targetUser.acceptPolygamy !== undefined) {
      if (acceptPolygamy === targetUser.acceptPolygamy) {
        score += 20;
      } else {
        score -= 20;
      }
    }

    // Check house availability requirement
    if (requireHouse && targetUser.houseAvailable !== undefined) {
      if (targetUser.houseAvailable) {
        score += 10;
      } else {
        score -= 30; // Strong penalty if house is required but not available
      }
    }

    return Math.max(0, Math.min(100, score)); // Clamp between 0-100
  }
}
