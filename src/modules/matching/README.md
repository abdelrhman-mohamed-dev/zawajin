# Matching Module

The Matching Module provides intelligent matchmaking capabilities for the Zawaj-In platform. It uses a weighted compatibility scoring algorithm to recommend potential matches based on user preferences.

## Features

- **Customizable Preferences**: Users can set detailed preferences for potential matches
- **Weighted Scoring**: Each matching criterion has customizable importance weights (0-10)
- **Smart Filtering**: Automatically excludes inactive, banned, deleted, and unverified users
- **Detailed Score Breakdown**: Transparent compatibility scoring with individual component scores
- **Pagination Support**: Efficient browsing of recommendations
- **Advanced Filters**: Filter by gender, age range, marital status, and minimum compatibility score

## Endpoints

### 1. Update Matching Preferences
```http
PUT /matching/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "minAge": 25,
  "maxAge": 35,
  "preferredCity": "Dubai",
  "preferredCountry": "UAE",
  "preferredReligiousPractices": ["Religious", "Moderate"],
  "preferredSects": ["Sunni"],
  "preferredMaritalStatuses": ["single", "divorced"],
  "lookingForGender": "female",
  "ageImportance": 5,
  "locationImportance": 7,
  "religiousImportance": 9,
  "maritalStatusImportance": 6,
  "professionImportance": 3
}
```

### 2. Get Matching Preferences
```http
GET /matching/preferences
Authorization: Bearer {token}
```

### 3. Get Match Recommendations
```http
GET /matching/recommendations?page=1&limit=10&minCompatibilityScore=60&gender=female
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `minCompatibilityScore` (optional): Minimum compatibility score (0-100)
- `gender` (optional): Filter by gender (male/female)
- `maritalStatus` (optional): Filter by marital status (single/divorced/widowed)
- `minAge` (optional): Minimum age filter
- `maxAge` (optional): Maximum age filter

## Compatibility Score Algorithm

The matching algorithm calculates compatibility scores from 0-100 using weighted scoring across five dimensions:

### 1. Age Compatibility (0-100)
- Same age: 100 points
- 1-2 years difference: 90 points
- 3-5 years difference: 75 points
- 6-8 years difference: 60 points
- 9-10 years difference: 40 points
- 10+ years difference: 20 points

### 2. Location Compatibility (0-100)
- Same city and country: 100 points
- Same country: 70 points
- Different country: 30 points

### 3. Religious Compatibility (0-100)
Base score of 50, adjusted by:
- Matches preferred religious practice: +30 points
- Matches preferred sect: +10 points
- Matches preferred prayer level: +10 points
- Doesn't match preference: -10 to -20 points

### 4. Marital Status Compatibility (0-100)
- Matches preference: 100 points
- No preference set: 50 points (neutral)
- Doesn't match preference: 0 points

### 5. Profession Compatibility (0-100)
- Matches preference: 100 points
- No preference set: 50 points (neutral)
- Doesn't match preference: 30 points

### Final Score Calculation

```
totalScore = (ageScore × ageImportance +
              locationScore × locationImportance +
              religiousScore × religiousImportance +
              maritalStatusScore × maritalStatusImportance +
              professionScore × professionImportance) / totalImportance
```

Where `totalImportance` is the sum of all importance weights.

## Response Format

### Recommendations Response
```json
{
  "success": true,
  "message": "Match recommendations retrieved successfully",
  "data": [
    {
      "userId": "uuid",
      "fullName": "John Doe",
      "age": 28,
      "gender": "male",
      "location": {
        "city": "Dubai",
        "country": "UAE"
      },
      "bio": "Software engineer looking for a life partner",
      "religiousPractice": "Religious",
      "sect": "Sunni",
      "prayerLevel": "Prays 5 times a day",
      "maritalStatus": "single",
      "profession": "Engineer",
      "compatibilityScore": 85,
      "scoreBreakdown": {
        "ageScore": 90,
        "locationScore": 100,
        "religiousScore": 90,
        "maritalStatusScore": 100,
        "professionScore": 50
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## Database Schema

### MatchingPreferences Table
```sql
CREATE TABLE matching_preferences (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  min_age INT,
  max_age INT,
  preferred_city VARCHAR(100),
  preferred_country VARCHAR(100),
  max_distance_km INT,
  preferred_religious_practices JSONB,
  preferred_sects JSONB,
  preferred_prayer_levels JSONB,
  preferred_marital_statuses JSONB,
  preferred_professions JSONB,
  looking_for_gender VARCHAR(10),
  age_importance INT DEFAULT 5,
  location_importance INT DEFAULT 5,
  religious_importance INT DEFAULT 8,
  marital_status_importance INT DEFAULT 5,
  profession_importance INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_matching_preferences_user ON matching_preferences(user_id);
```

## Usage Example

```typescript
// Update preferences
const preferences = await matchingService.updatePreferences(userId, {
  minAge: 25,
  maxAge: 35,
  preferredCity: 'Dubai',
  preferredReligiousPractices: ['Religious', 'Moderate'],
  lookingForGender: 'female',
  religiousImportance: 9,
  locationImportance: 7,
});

// Get recommendations
const recommendations = await matchingService.getRecommendations(userId, {
  page: 1,
  limit: 10,
  minCompatibilityScore: 60,
});
```

## Future Enhancements

- Machine learning-based recommendations
- Collaborative filtering based on successful matches
- Behavioral analysis (response rate, conversation quality)
- Geographic distance calculation using coordinates
- Profile completion impact on recommendations
- A/B testing for algorithm improvements

## Notes

- Users must be email verified to appear in recommendations
- Inactive, banned, and deleted users are automatically filtered out
- Recommendations are sorted by compatibility score in descending order
- The algorithm fetches more users than requested to ensure quality results after filtering
- All endpoints require JWT authentication
