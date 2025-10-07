import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/auth/entities/user.entity';

const users = [
  // Male Users
  {
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+971501234501',
    gender: 'male',
    age: 28,
    bio: 'Software engineer passionate about technology and family values. Looking for a kind and practicing Muslim woman to build a life together.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Software Engineer',
  },
  {
    fullName: 'Omar Abdullah',
    email: 'omar.abdullah@example.com',
    phone: '+971501234502',
    gender: 'male',
    age: 32,
    bio: 'Doctor working in healthcare. Family-oriented and looking for a serious relationship.',
    location: { city: 'Abu Dhabi', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'divorced',
    profession: 'Doctor',
  },
  {
    fullName: 'Khalid Rahman',
    email: 'khalid.rahman@example.com',
    phone: '+971501234503',
    gender: 'male',
    age: 30,
    bio: 'Business owner seeking a practicing Muslim woman. I value honesty and respect.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Moderate',
    sect: 'Sunni',
    prayerLevel: 'Sometimes',
    maritalStatus: 'single',
    profession: 'Business Owner',
  },
  {
    fullName: 'Yusuf Ali',
    email: 'yusuf.ali@example.com',
    phone: '+971501234504',
    gender: 'male',
    age: 35,
    bio: 'Teacher with strong Islamic values. Looking for a life partner who shares the same vision.',
    location: { city: 'Sharjah', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'widowed',
    profession: 'Teacher',
  },
  {
    fullName: 'Ibrahim Mahmoud',
    email: 'ibrahim.mahmoud@example.com',
    phone: '+971501234505',
    gender: 'male',
    age: 27,
    bio: 'Engineer working on innovative projects. Seeking a kind-hearted woman for marriage.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Moderate',
    sect: 'Sunni',
    prayerLevel: 'Sometimes',
    maritalStatus: 'single',
    profession: 'Engineer',
  },
  // Female Users
  {
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    phone: '+971501234506',
    gender: 'female',
    age: 25,
    bio: 'Graduate student pursuing my masters. Looking for a practicing Muslim man who values education and family.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Student',
  },
  {
    fullName: 'Aisha Mohammed',
    email: 'aisha.mohammed@example.com',
    phone: '+971501234507',
    gender: 'female',
    age: 29,
    bio: 'Pharmacist with a passion for helping others. Seeking a God-fearing man for a blessed marriage.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Pharmacist',
  },
  {
    fullName: 'Maryam Ahmed',
    email: 'maryam.ahmed@example.com',
    phone: '+971501234508',
    gender: 'female',
    age: 31,
    bio: 'Designer working in the creative industry. Looking for someone who appreciates art and has strong values.',
    location: { city: 'Abu Dhabi', country: 'UAE' },
    religiousPractice: 'Moderate',
    sect: 'Sunni',
    prayerLevel: 'Sometimes',
    maritalStatus: 'divorced',
    profession: 'Designer',
  },
  {
    fullName: 'Khadija Yusuf',
    email: 'khadija.yusuf@example.com',
    phone: '+971501234509',
    gender: 'female',
    age: 26,
    bio: 'Marketing professional with a love for travel. Seeking a partner for both dunya and akhirah.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Marketing Specialist',
  },
  {
    fullName: 'Sara Ibrahim',
    email: 'sara.ibrahim@example.com',
    phone: '+971501234510',
    gender: 'female',
    age: 28,
    bio: 'Nurse dedicated to caring for others. Looking for a compassionate and understanding life partner.',
    location: { city: 'Sharjah', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Nurse',
  },
  {
    fullName: 'Layla Hassan',
    email: 'layla.hassan@example.com',
    phone: '+971501234511',
    gender: 'female',
    age: 30,
    bio: 'Entrepreneur running my own business. Seeking a supportive partner to share success and faith.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Moderate',
    sect: 'Sunni',
    prayerLevel: 'Sometimes',
    maritalStatus: 'single',
    profession: 'Entrepreneur',
  },
  {
    fullName: 'Zainab Ali',
    email: 'zainab.ali@example.com',
    phone: '+971501234512',
    gender: 'female',
    age: 27,
    bio: 'Teacher passionate about education and children. Looking for a family-oriented man.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Teacher',
  },
  // Additional users for diversity
  {
    fullName: 'Hassan Khalil',
    email: 'hassan.khalil@example.com',
    phone: '+971501234513',
    gender: 'male',
    age: 33,
    bio: 'Accountant with stable career. Seeking a responsible and caring woman.',
    location: { city: 'Ajman', country: 'UAE' },
    religiousPractice: 'Moderate',
    sect: 'Sunni',
    prayerLevel: 'Sometimes',
    maritalStatus: 'single',
    profession: 'Accountant',
  },
  {
    fullName: 'Nadia Omar',
    email: 'nadia.omar@example.com',
    phone: '+971501234514',
    gender: 'female',
    age: 24,
    bio: 'Recent graduate starting my career. Looking for someone who can grow with me.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Religious',
    sect: 'Sunni',
    prayerLevel: 'Prays 5 times a day',
    maritalStatus: 'single',
    profession: 'Analyst',
  },
  {
    fullName: 'Mustafa Tariq',
    email: 'mustafa.tariq@example.com',
    phone: '+971501234515',
    gender: 'male',
    age: 36,
    bio: 'Architect designing the future. Looking for a creative and supportive partner.',
    location: { city: 'Dubai', country: 'UAE' },
    religiousPractice: 'Moderate',
    sect: 'Sunni',
    prayerLevel: 'Sometimes',
    maritalStatus: 'divorced',
    profession: 'Architect',
  },
];

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);

  // Default password for all test users
  const defaultPassword = 'Test@123';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const createdUsers: User[] = [];

  for (const userData of users) {
    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`  ⏭️  User already exists: ${userData.email}`);
      createdUsers.push(existingUser);
      continue;
    }

    // Create new user
    const user = userRepository.create({
      ...userData,
      passwordHash,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      role: 'user',
    });

    const savedUser = await userRepository.save(user);
    createdUsers.push(savedUser);
    console.log(`  ✅ Created user: ${userData.fullName} (${userData.email})`);
  }

  console.log(`\n  📊 Total users created: ${createdUsers.length}`);
  console.log(`  🔑 Default password for all users: ${defaultPassword}`);

  return createdUsers;
}
