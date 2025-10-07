import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/auth/entities/user.entity';

export async function seedSuperAdmin(dataSource: DataSource, configService: ConfigService) {
  const userRepository = dataSource.getRepository(User);

  // Get super admin details from environment variables
  const email = configService.get<string>('SUPER_ADMIN_EMAIL', 'superadmin@zawaj.in');
  const password = configService.get<string>('SUPER_ADMIN_PASSWORD', 'SuperAdmin@123');
  const fullName = configService.get<string>('SUPER_ADMIN_FULL_NAME', 'Super Administrator');
  const phone = configService.get<string>('SUPER_ADMIN_PHONE', '+1234567890');
  const gender = configService.get<string>('SUPER_ADMIN_GENDER', 'male');

  // Check if super admin already exists
  const existingSuperAdmin = await userRepository.findOne({
    where: { email },
  });

  if (existingSuperAdmin) {
    console.log('✅ Super admin already exists:', email);
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create super admin user
  const superAdmin = userRepository.create({
    fullName,
    email,
    phone,
    gender,
    passwordHash,
    role: 'super_admin',
    permissions: null, // Super admin has all permissions by default
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
