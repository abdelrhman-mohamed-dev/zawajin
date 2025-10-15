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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async create(userData) {
        const user = this.userRepo.create(userData);
        return await this.userRepo.save(user);
    }
    async findByEmail(email) {
        return await this.userRepo.findOne({ where: { email } });
    }
    async findByPhone(phone) {
        return await this.userRepo.findOne({ where: { phone } });
    }
    async findById(id) {
        return await this.userRepo.findOne({ where: { id } });
    }
    async findByChartNumber(chartNumber) {
        return await this.userRepo.findOne({ where: { chartNumber } });
    }
    async updateEmailVerified(id, isVerified) {
        await this.userRepo.update(id, { isEmailVerified: isVerified });
    }
    async updatePhoneVerified(id, isVerified) {
        await this.userRepo.update(id, { isPhoneVerified: isVerified });
    }
    async updateFcmToken(id, fcmToken) {
        await this.userRepo.update(id, { fcmToken });
    }
    async updatePassword(id, passwordHash) {
        await this.userRepo.update(id, { passwordHash });
    }
    async isEmailExists(email) {
        const count = await this.userRepo.count({ where: { email } });
        return count > 0;
    }
    async isPhoneExists(phone) {
        const count = await this.userRepo.count({ where: { phone } });
        return count > 0;
    }
    async update(id, updateData) {
        await this.userRepo.update(id, updateData);
        return this.findById(id);
    }
    async updateProfile(userId, profileData) {
        await this.userRepo.update(userId, profileData);
        return this.findById(userId);
    }
    async findAll(page = 1, limit = 20, search, role, isBanned, isVerified) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.userRepo
            .createQueryBuilder('user')
            .where('user.isDeleted = :isDeleted', { isDeleted: false });
        if (search) {
            queryBuilder.andWhere('(user.email ILIKE :search OR user.fullName ILIKE :search OR user.chartNumber ILIKE :search)', { search: `%${search}%` });
        }
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }
        if (isBanned !== undefined) {
            queryBuilder.andWhere('user.isBanned = :isBanned', { isBanned });
        }
        if (isVerified !== undefined) {
            queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified });
        }
        const total = await queryBuilder.getCount();
        const users = await queryBuilder
            .select([
            'user.id',
            'user.fullName',
            'user.email',
            'user.phone',
            'user.gender',
            'user.chartNumber',
            'user.bio',
            'user.age',
            'user.location',
            'user.religiousPractice',
            'user.sect',
            'user.prayerLevel',
            'user.maritalStatus',
            'user.profession',
            'user.role',
            'user.permissions',
            'user.isBanned',
            'user.banType',
            'user.bannedAt',
            'user.bannedUntil',
            'user.bannedReason',
            'user.isVerified',
            'user.verifiedAt',
            'user.isEmailVerified',
            'user.isPhoneVerified',
            'user.isActive',
            'user.createdAt',
            'user.updatedAt',
        ])
            .skip(skip)
            .take(limit)
            .orderBy('user.createdAt', 'DESC')
            .getMany();
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findAllUsers(queryDto) {
        const { page = 1, limit = 10, ...filters } = queryDto;
        const skip = (page - 1) * limit;
        const queryBuilder = this.userRepo
            .createQueryBuilder('user')
            .where('user.isActive = :isActive', { isActive: true })
            .andWhere('user.isEmailVerified = :isEmailVerified', {
            isEmailVerified: true,
        });
        if (filters.gender) {
            queryBuilder.andWhere('user.gender = :gender', {
                gender: filters.gender,
            });
        }
        if (filters.maritalStatus) {
            queryBuilder.andWhere('user.maritalStatus = :maritalStatus', {
                maritalStatus: filters.maritalStatus,
            });
        }
        if (filters.minAge) {
            queryBuilder.andWhere('user.age >= :minAge', { minAge: filters.minAge });
        }
        if (filters.maxAge) {
            queryBuilder.andWhere('user.age <= :maxAge', { maxAge: filters.maxAge });
        }
        if (filters.city) {
            queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
            queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'city' = :city", {
                city: filters.city,
            });
        }
        if (filters.country) {
            queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
            queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'country' = :country", {
                country: filters.country,
            });
        }
        if (filters.origin) {
            queryBuilder.andWhere('user.origin = :origin', {
                origin: filters.origin,
            });
        }
        if (filters.religiousPractice) {
            queryBuilder.andWhere('user.religiousPractice = :religiousPractice', {
                religiousPractice: filters.religiousPractice,
            });
        }
        if (filters.sect) {
            queryBuilder.andWhere('user.sect = :sect', {
                sect: filters.sect,
            });
        }
        if (filters.prayerLevel) {
            queryBuilder.andWhere('user.prayerLevel = :prayerLevel', {
                prayerLevel: filters.prayerLevel,
            });
        }
        if (filters.profession) {
            queryBuilder.andWhere('user.profession = :profession', {
                profession: filters.profession,
            });
        }
        if (filters.natureOfWork) {
            queryBuilder.andWhere('user.natureOfWork = :natureOfWork', {
                natureOfWork: filters.natureOfWork,
            });
        }
        if (filters.minHeight) {
            queryBuilder.andWhere('user.height >= :minHeight', {
                minHeight: filters.minHeight,
            });
        }
        if (filters.maxHeight) {
            queryBuilder.andWhere('user.height <= :maxHeight', {
                maxHeight: filters.maxHeight,
            });
        }
        if (filters.minWeight) {
            queryBuilder.andWhere('user.weight >= :minWeight', {
                minWeight: filters.minWeight,
            });
        }
        if (filters.maxWeight) {
            queryBuilder.andWhere('user.weight <= :maxWeight', {
                maxWeight: filters.maxWeight,
            });
        }
        if (filters.bodyColor) {
            queryBuilder.andWhere('user.bodyColor = :bodyColor', {
                bodyColor: filters.bodyColor,
            });
        }
        if (filters.hairColor) {
            queryBuilder.andWhere('user.hairColor = :hairColor', {
                hairColor: filters.hairColor,
            });
        }
        if (filters.hairType) {
            queryBuilder.andWhere('user.hairType = :hairType', {
                hairType: filters.hairType,
            });
        }
        if (filters.eyeColor) {
            queryBuilder.andWhere('user.eyeColor = :eyeColor', {
                eyeColor: filters.eyeColor,
            });
        }
        if (filters.marriageType) {
            queryBuilder.andWhere('user.marriageType = :marriageType', {
                marriageType: filters.marriageType,
            });
        }
        if (filters.houseAvailable !== undefined) {
            queryBuilder.andWhere('user.houseAvailable = :houseAvailable', {
                houseAvailable: filters.houseAvailable,
            });
        }
        if (filters.acceptPolygamy !== undefined) {
            queryBuilder.andWhere('user.acceptPolygamy = :acceptPolygamy', {
                acceptPolygamy: filters.acceptPolygamy,
            });
        }
        const total = await queryBuilder.getCount();
        const users = await queryBuilder
            .select([
            'user.id',
            'user.fullName',
            'user.email',
            'user.gender',
            'user.chartNumber',
            'user.bio',
            'user.age',
            'user.dateOfBirth',
            'user.location',
            'user.origin',
            'user.religiousPractice',
            'user.sect',
            'user.prayerLevel',
            'user.maritalStatus',
            'user.profession',
            'user.weight',
            'user.height',
            'user.bodyColor',
            'user.hairColor',
            'user.hairType',
            'user.eyeColor',
            'user.houseAvailable',
            'user.natureOfWork',
            'user.marriageType',
            'user.acceptPolygamy',
            'user.createdAt',
        ])
            .skip(skip)
            .take(limit)
            .orderBy('user.createdAt', 'DESC')
            .getMany();
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async save(user) {
        return this.userRepo.save(user);
    }
    async delete(id) {
        await this.userRepo.delete(id);
    }
    async findLatestUsers(limit = 10) {
        return await this.userRepo
            .createQueryBuilder('user')
            .where('user.isActive = :isActive', { isActive: true })
            .andWhere('user.isEmailVerified = :isEmailVerified', {
            isEmailVerified: true,
        })
            .select([
            'user.id',
            'user.fullName',
            'user.email',
            'user.gender',
            'user.chartNumber',
            'user.bio',
            'user.age',
            'user.dateOfBirth',
            'user.location',
            'user.origin',
            'user.religiousPractice',
            'user.sect',
            'user.prayerLevel',
            'user.maritalStatus',
            'user.profession',
            'user.weight',
            'user.height',
            'user.bodyColor',
            'user.hairColor',
            'user.hairType',
            'user.eyeColor',
            'user.houseAvailable',
            'user.natureOfWork',
            'user.marriageType',
            'user.acceptPolygamy',
            'user.createdAt',
        ])
            .orderBy('user.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepository);
//# sourceMappingURL=user.repository.js.map