"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedMatchingPreferences = seedMatchingPreferences;
const matching_preferences_entity_1 = require("../../modules/matching/entities/matching-preferences.entity");
async function seedMatchingPreferences(dataSource, users) {
    const preferencesRepository = dataSource.getRepository(matching_preferences_entity_1.MatchingPreferences);
    const preferencesData = [
        {
            user: users.find((u) => u.email === 'ahmed.hassan@example.com'),
            minAge: 24,
            maxAge: 32,
            preferredCity: 'Dubai',
            preferredCountry: 'UAE',
            maxDistanceKm: 50,
            preferredReligiousPractices: ['Religious', 'Moderate'],
            preferredSects: ['Sunni'],
            preferredPrayerLevels: ['Prays 5 times a day', 'Sometimes'],
            preferredMaritalStatuses: ['single', 'divorced'],
            preferredProfessions: ['Teacher', 'Nurse', 'Pharmacist', 'Student'],
            lookingForGender: 'female',
            ageImportance: 6,
            locationImportance: 7,
            religiousImportance: 9,
            maritalStatusImportance: 5,
            professionImportance: 3,
        },
        {
            user: users.find((u) => u.email === 'fatima.zahra@example.com'),
            minAge: 26,
            maxAge: 35,
            preferredCity: 'Dubai',
            preferredCountry: 'UAE',
            maxDistanceKm: 100,
            preferredReligiousPractices: ['Religious'],
            preferredSects: ['Sunni'],
            preferredPrayerLevels: ['Prays 5 times a day'],
            preferredMaritalStatuses: ['single', 'widowed'],
            preferredProfessions: ['Engineer', 'Doctor', 'Teacher'],
            lookingForGender: 'male',
            ageImportance: 5,
            locationImportance: 6,
            religiousImportance: 10,
            maritalStatusImportance: 7,
            professionImportance: 4,
        },
        {
            user: users.find((u) => u.email === 'omar.abdullah@example.com'),
            minAge: 25,
            maxAge: 35,
            preferredCountry: 'UAE',
            maxDistanceKm: 150,
            preferredReligiousPractices: ['Religious', 'Moderate'],
            preferredSects: ['Sunni'],
            preferredPrayerLevels: ['Prays 5 times a day', 'Sometimes'],
            preferredMaritalStatuses: ['single', 'divorced', 'widowed'],
            lookingForGender: 'female',
            ageImportance: 4,
            locationImportance: 5,
            religiousImportance: 8,
            maritalStatusImportance: 3,
            professionImportance: 2,
        },
        {
            user: users.find((u) => u.email === 'aisha.mohammed@example.com'),
            minAge: 28,
            maxAge: 38,
            preferredCity: 'Dubai',
            preferredCountry: 'UAE',
            maxDistanceKm: 80,
            preferredReligiousPractices: ['Religious'],
            preferredSects: ['Sunni'],
            preferredPrayerLevels: ['Prays 5 times a day'],
            preferredMaritalStatuses: ['single', 'divorced'],
            preferredProfessions: ['Engineer', 'Doctor', 'Business Owner'],
            lookingForGender: 'male',
            ageImportance: 6,
            locationImportance: 7,
            religiousImportance: 9,
            maritalStatusImportance: 4,
            professionImportance: 5,
        },
        {
            user: users.find((u) => u.email === 'khalid.rahman@example.com'),
            minAge: 24,
            maxAge: 32,
            preferredCity: 'Dubai',
            preferredCountry: 'UAE',
            maxDistanceKm: 60,
            preferredReligiousPractices: ['Religious', 'Moderate'],
            preferredSects: ['Sunni'],
            preferredMaritalStatuses: ['single'],
            lookingForGender: 'female',
            ageImportance: 7,
            locationImportance: 8,
            religiousImportance: 6,
            maritalStatusImportance: 8,
            professionImportance: 2,
        },
        {
            user: users.find((u) => u.email === 'maryam.ahmed@example.com'),
            minAge: 30,
            maxAge: 40,
            preferredCountry: 'UAE',
            maxDistanceKm: 200,
            preferredReligiousPractices: ['Moderate', 'Religious'],
            preferredSects: ['Sunni'],
            preferredMaritalStatuses: ['divorced', 'single', 'widowed'],
            lookingForGender: 'male',
            ageImportance: 5,
            locationImportance: 4,
            religiousImportance: 7,
            maritalStatusImportance: 2,
            professionImportance: 3,
        },
        {
            user: users.find((u) => u.email === 'khadija.yusuf@example.com'),
            minAge: 26,
            maxAge: 34,
            preferredCity: 'Dubai',
            preferredCountry: 'UAE',
            maxDistanceKm: 70,
            preferredReligiousPractices: ['Religious'],
            preferredSects: ['Sunni'],
            preferredPrayerLevels: ['Prays 5 times a day'],
            preferredMaritalStatuses: ['single'],
            preferredProfessions: ['Engineer', 'Doctor', 'Business Owner', 'Architect'],
            lookingForGender: 'male',
            ageImportance: 6,
            locationImportance: 7,
            religiousImportance: 9,
            maritalStatusImportance: 6,
            professionImportance: 4,
        },
        {
            user: users.find((u) => u.email === 'ibrahim.mahmoud@example.com'),
            minAge: 23,
            maxAge: 30,
            preferredCity: 'Dubai',
            preferredCountry: 'UAE',
            maxDistanceKm: 50,
            preferredReligiousPractices: ['Religious', 'Moderate'],
            preferredSects: ['Sunni'],
            preferredMaritalStatuses: ['single'],
            lookingForGender: 'female',
            ageImportance: 5,
            locationImportance: 6,
            religiousImportance: 7,
            maritalStatusImportance: 7,
            professionImportance: 2,
        },
    ];
    let createdCount = 0;
    for (const prefData of preferencesData) {
        if (!prefData.user) {
            continue;
        }
        const existing = await preferencesRepository.findOne({
            where: { userId: prefData.user.id },
        });
        if (existing) {
            console.log(`  ⏭️  Preferences already exist for: ${prefData.user.fullName}`);
            continue;
        }
        const preferences = preferencesRepository.create({
            userId: prefData.user.id,
            ...prefData,
        });
        await preferencesRepository.save(preferences);
        createdCount++;
        console.log(`  ✅ Created preferences for: ${prefData.user.fullName}`);
    }
    console.log(`\n  📊 Total matching preferences created: ${createdCount}`);
}
//# sourceMappingURL=matching-preferences.seed.js.map