"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = seedSuperAdmin;
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../modules/auth/entities/user.entity");
async function seedSuperAdmin(dataSource, configService) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const email = configService.get('SUPER_ADMIN_EMAIL', 'superadmin@zawaj.in');
    const password = configService.get('SUPER_ADMIN_PASSWORD', 'SuperAdmin@123');
    const fullName = configService.get('SUPER_ADMIN_FULL_NAME', 'Super Administrator');
    const phone = configService.get('SUPER_ADMIN_PHONE', '+1234567890');
    const gender = configService.get('SUPER_ADMIN_GENDER', 'male');
    const existingSuperAdmin = await userRepository.findOne({
        where: { email },
    });
    if (existingSuperAdmin) {
        console.log('✅ Super admin already exists:', email);
        return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const superAdmin = userRepository.create({
        fullName,
        email,
        phone,
        gender,
        passwordHash,
        role: 'super_admin',
        permissions: null,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true,
        isVerified: true,
        verifiedAt: new Date(),
    });
    await userRepository.save(superAdmin);
    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('⚠️  Please change the password after first login!');
}
//# sourceMappingURL=super-admin.seed.js.map