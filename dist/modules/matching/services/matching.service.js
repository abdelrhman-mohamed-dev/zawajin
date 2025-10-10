"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const matching_preferences_repository_1 = require("../repositories/matching-preferences.repository");
const like_entity_1 = require("../../interactions/entities/like.entity");
let MatchingService = class MatchingService {
    constructor(userRepository, likeRepository, preferencesRepository) {
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.preferencesRepository = preferencesRepository;
    }
    async updatePreferences(userId, data) {
        return await this.preferencesRepository.createOrUpdate(userId, data);
    }
    async getPreferences(userId) {
        const preferences = await this.preferencesRepository.findByUserId(userId);
        if (!preferences) {
            throw new common_1.NotFoundException('Matching preferences not found');
        }
        return preferences;
    }
    async getRecommendations(userId, query) {
        const { page = 1, limit = 10, minCompatibilityScore, gender, maritalStatus, minAge, maxAge } = query;
        const skip = (page - 1) * limit;
        const currentUser = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!currentUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const preferences = await this.preferencesRepository.findByUserId(userId);
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .where('user.id != :userId', { userId })
            .andWhere('user.isActive = :isActive', { isActive: true })
            .andWhere('user.isBanned = :isBanned', { isBanned: false })
            .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified: true });
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
            queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
            queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'city' = :city", {
                city: preferences.preferredCity,
            });
        }
        if (preferences?.preferredCountry) {
            queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
            queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'country' = :country", {
                country: preferences.preferredCountry,
            });
        }
        const total = await queryBuilder.getCount();
        const users = await queryBuilder
            .skip(skip)
            .take(limit * 2)
            .getMany();
        const userLikes = await this.likeRepository.find({
            where: { userId },
            select: ['likedUserId'],
        });
        const likedUserIds = new Set(userLikes.map(like => like.likedUserId));
        const recommendations = users
            .map((user) => {
            const compatibility = this.calculateCompatibilityScore(currentUser, user, preferences);
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
                weight: user.weight,
                height: user.height,
                bodyColor: user.bodyColor,
                hairColor: user.hairColor,
                hairType: user.hairType,
                eyeColor: user.eyeColor,
                houseAvailable: user.houseAvailable,
                natureOfWork: user.natureOfWork,
                marriageType: user.marriageType,
                acceptPolygamy: user.acceptPolygamy,
                compatibilityScore: compatibility.totalScore,
                scoreBreakdown: compatibility.breakdown,
                hasLiked: likedUserIds.has(user.id),
            };
        })
            .filter((rec) => {
            if (minCompatibilityScore) {
                return rec.compatibilityScore >= minCompatibilityScore;
            }
            return true;
        })
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
            .slice(0, limit);
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
    calculateCompatibilityScore(currentUser, targetUser, preferences) {
        const weights = {
            age: preferences?.ageImportance || 5,
            location: preferences?.locationImportance || 5,
            religious: preferences?.religiousImportance || 8,
            maritalStatus: preferences?.maritalStatusImportance || 5,
            profession: preferences?.professionImportance || 3,
            physicalAttributes: preferences?.physicalAttributesImportance || 5,
            marriageType: preferences?.marriageTypeImportance || 7,
        };
        const totalWeight = weights.age +
            weights.location +
            weights.religious +
            weights.maritalStatus +
            weights.profession +
            weights.physicalAttributes +
            weights.marriageType;
        const ageScore = this.calculateAgeScore(currentUser.age, targetUser.age, preferences);
        const locationScore = this.calculateLocationScore(currentUser.location, targetUser.location);
        const religiousScore = this.calculateReligiousScore(targetUser.religiousPractice, targetUser.sect, targetUser.prayerLevel, preferences);
        const maritalStatusScore = this.calculateMaritalStatusScore(targetUser.maritalStatus, preferences);
        const professionScore = this.calculateProfessionScore(targetUser.profession, preferences);
        const physicalAttributesScore = this.calculatePhysicalAttributesScore(currentUser, targetUser, preferences);
        const marriageTypeScore = this.calculateMarriageTypeScore(currentUser, targetUser, preferences);
        const totalScore = Math.round((ageScore * weights.age +
            locationScore * weights.location +
            religiousScore * weights.religious +
            maritalStatusScore * weights.maritalStatus +
            professionScore * weights.profession +
            physicalAttributesScore * weights.physicalAttributes +
            marriageTypeScore * weights.marriageType) /
            totalWeight);
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
    calculateAgeScore(currentAge, targetAge, preferences) {
        if (!currentAge || !targetAge)
            return 50;
        if (preferences?.minAge && targetAge < preferences.minAge)
            return 0;
        if (preferences?.maxAge && targetAge > preferences.maxAge)
            return 0;
        const ageDiff = Math.abs(currentAge - targetAge);
        if (ageDiff === 0)
            return 100;
        if (ageDiff <= 2)
            return 90;
        if (ageDiff <= 5)
            return 75;
        if (ageDiff <= 8)
            return 60;
        if (ageDiff <= 10)
            return 40;
        return 20;
    }
    calculateLocationScore(currentLocation, targetLocation) {
        if (!currentLocation || !targetLocation)
            return 50;
        const sameCity = currentLocation.city === targetLocation.city;
        const sameCountry = currentLocation.country === targetLocation.country;
        if (sameCity && sameCountry)
            return 100;
        if (sameCountry)
            return 70;
        return 30;
    }
    calculateReligiousScore(religiousPractice, sect, prayerLevel, preferences) {
        let score = 50;
        if (preferences?.preferredReligiousPractices?.length > 0) {
            if (preferences.preferredReligiousPractices.includes(religiousPractice)) {
                score += 30;
            }
            else {
                score -= 20;
            }
        }
        if (preferences?.preferredSects?.length > 0) {
            if (preferences.preferredSects.includes(sect)) {
                score += 10;
            }
            else {
                score -= 10;
            }
        }
        if (preferences?.preferredPrayerLevels?.length > 0) {
            if (preferences.preferredPrayerLevels.includes(prayerLevel)) {
                score += 10;
            }
            else {
                score -= 5;
            }
        }
        return Math.max(0, Math.min(100, score));
    }
    calculateMaritalStatusScore(maritalStatus, preferences) {
        if (!maritalStatus)
            return 50;
        if (preferences?.preferredMaritalStatuses?.length > 0) {
            return preferences.preferredMaritalStatuses.includes(maritalStatus)
                ? 100
                : 0;
        }
        return 50;
    }
    calculateProfessionScore(profession, preferences) {
        if (!profession)
            return 50;
        if (preferences?.preferredProfessions?.length > 0) {
            return preferences.preferredProfessions.includes(profession) ? 100 : 30;
        }
        return 50;
    }
    calculatePhysicalAttributesScore(currentUser, targetUser, preferences) {
        let score = 50;
        let criteriaCount = 0;
        let matchedCriteria = 0;
        const minHeight = preferences?.preferredMinHeight || currentUser.preferredMinHeight;
        const maxHeight = preferences?.preferredMaxHeight || currentUser.preferredMaxHeight;
        const minWeight = preferences?.preferredMinWeight || currentUser.preferredMinWeight;
        const maxWeight = preferences?.preferredMaxWeight || currentUser.preferredMaxWeight;
        const bodyColors = preferences?.preferredBodyColors || currentUser.preferredBodyColors;
        const hairColors = preferences?.preferredHairColors || currentUser.preferredHairColors;
        const eyeColors = preferences?.preferredEyeColors || currentUser.preferredEyeColors;
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
        if (bodyColors?.length > 0) {
            criteriaCount++;
            if (targetUser.bodyColor && bodyColors.includes(targetUser.bodyColor)) {
                matchedCriteria++;
            }
        }
        if (hairColors?.length > 0) {
            criteriaCount++;
            if (targetUser.hairColor && hairColors.includes(targetUser.hairColor)) {
                matchedCriteria++;
            }
        }
        if (eyeColors?.length > 0) {
            criteriaCount++;
            if (targetUser.eyeColor && eyeColors.includes(targetUser.eyeColor)) {
                matchedCriteria++;
            }
        }
        if (criteriaCount > 0) {
            score = (matchedCriteria / criteriaCount) * 100;
        }
        return Math.max(0, Math.min(100, score));
    }
    calculateMarriageTypeScore(currentUser, targetUser, preferences) {
        let score = 50;
        const preferredMarriageTypes = preferences?.preferredMarriageTypes;
        const acceptPolygamy = preferences?.acceptPolygamy !== undefined
            ? preferences.acceptPolygamy
            : currentUser.acceptPolygamy;
        const requireHouse = preferences?.requireHouse;
        if (preferredMarriageTypes?.length > 0) {
            if (targetUser.marriageType && preferredMarriageTypes.includes(targetUser.marriageType)) {
                score += 20;
            }
            else if (targetUser.marriageType) {
                score -= 15;
            }
        }
        if (acceptPolygamy !== undefined && targetUser.acceptPolygamy !== undefined) {
            if (acceptPolygamy === targetUser.acceptPolygamy) {
                score += 20;
            }
            else {
                score -= 20;
            }
        }
        if (requireHouse && targetUser.houseAvailable !== undefined) {
            if (targetUser.houseAvailable) {
                score += 10;
            }
            else {
                score -= 30;
            }
        }
        return Math.max(0, Math.min(100, score));
    }
};
exports.MatchingService = MatchingService;
exports.MatchingService = MatchingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        matching_preferences_repository_1.MatchingPreferencesRepository])
], MatchingService);
//# sourceMappingURL=matching.service.js.map