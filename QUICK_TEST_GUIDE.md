# Quick Test Guide

## Setup

1. **Run Seeds:**
   ```bash
   npm run seed
   ```

2. **Start Server:**
   ```bash
   npm run start:dev
   ```

3. **Access Swagger:**
   ```
   http://localhost:5000/api/docs
   ```

## Test Accounts

### Regular Users
| Name | Email | Password | Profile |
|------|-------|----------|---------|
| Ahmed Hassan | ahmed.hassan@example.com | Test@123 | Male, 28, Engineer |
| Fatima Zahra | fatima.zahra@example.com | Test@123 | Female, 25, Student |
| Omar Abdullah | omar.abdullah@example.com | Test@123 | Male, 32, Doctor |
| Aisha Mohammed | aisha.mohammed@example.com | Test@123 | Female, 29, Pharmacist |
| Khalid Rahman | khalid.rahman@example.com | Test@123 | Male, 30, Business Owner |

### Super Admin
| Email | Password |
|-------|----------|
| superadmin@zawaj.in | SuperAdmin@123 |

## Quick API Tests

### 1. Login & Get Token
```bash
POST /auth/login
{
  "email": "ahmed.hassan@example.com",
  "password": "Test@123"
}
```
Copy the `accessToken` from response.

### 2. Test Matching Algorithm
```bash
GET /matching/recommendations?page=1&limit=10&minCompatibilityScore=60
Authorization: Bearer {your-token}
```

### 3. Get Your Preferences
```bash
GET /matching/preferences
Authorization: Bearer {your-token}
```

### 4. Update Preferences
```bash
PUT /matching/preferences
Authorization: Bearer {your-token}
{
  "minAge": 25,
  "maxAge": 35,
  "preferredCity": "Dubai",
  "lookingForGender": "female",
  "religiousImportance": 9
}
```

### 5. View Conversations
```bash
GET /chat/conversations
Authorization: Bearer {your-token}
```

### 6. Send a Like
```bash
POST /users/{userId}/like
Authorization: Bearer {your-token}
```

## Testing Matching Algorithm

### Scenario 1: High Compatibility Match
Login as **Ahmed Hassan**, then:
```bash
GET /matching/recommendations?minCompatibilityScore=70
```
Expected: Should see **Fatima Zahra** with high score (they're already matched)

### Scenario 2: Filter by Gender
```bash
GET /matching/recommendations?gender=female
```
Expected: Only female users in results

### Scenario 3: Age Range Filter
```bash
GET /matching/recommendations?minAge=27&maxAge=30
```
Expected: Only users aged 27-30

### Scenario 4: Location Preference
Login as user with **Dubai** preference:
```bash
GET /matching/recommendations
```
Expected: Dubai users score higher in compatibility

## Testing Chat

### View Existing Conversations
Login as **Ahmed Hassan** or **Fatima Zahra**:
```bash
GET /chat/conversations
```
Expected: 1 conversation between them

### Send Message
```bash
POST /chat/conversations/{conversationId}/messages
{
  "content": "Hello! How are you?",
  "messageType": "text"
}
```

## Testing Admin Features

### Login as Super Admin
```bash
POST /auth/login
{
  "email": "superadmin@zawaj.in",
  "password": "SuperAdmin@123"
}
```

### View All Users
```bash
GET /admin/users?page=1&limit=20
Authorization: Bearer {admin-token}
```

### View Analytics
```bash
GET /admin/analytics/overview
GET /admin/analytics/users
GET /admin/analytics/matches
Authorization: Bearer {admin-token}
```

## Expected Results

### Users Seeded
- ✅ 15 test users (7 male, 8 female)
- ✅ All verified and active
- ✅ Diverse profiles

### Matches Created
- ✅ Ahmed ↔ Fatima (4 messages)
- ✅ Omar ↔ Maryam (2 messages)
- ✅ Khalid ↔ Khadija (3 messages)
- ✅ Ibrahim ↔ Nadia (2 messages)

### Matching Preferences
- ✅ 8 users have preferences set
- ✅ Various age ranges
- ✅ Different importance weights

## Common Issues

### Issue: "Preferences not found"
**Solution:** Login as a user who has preferences:
- ahmed.hassan@example.com
- fatima.zahra@example.com
- omar.abdullah@example.com
- aisha.mohammed@example.com

### Issue: "No conversations found"
**Solution:** Login as a matched user:
- ahmed.hassan@example.com (matched with Fatima)
- fatima.zahra@example.com (matched with Ahmed)
- omar.abdullah@example.com (matched with Maryam)
- etc.

### Issue: Low compatibility scores
**Solution:**
- Check user preferences
- Ensure matching criteria align
- Try different users with diverse preferences

## Postman Collection

Import `zawajin.json` for ready-made requests:
1. Open Postman
2. Import → File → Select `zawajin.json`
3. Set `{{authToken}}` variable after login
4. Test all endpoints

## Useful Commands

```bash
# View logs
npm run start:dev

# Re-seed database
npm run seed

# Build project
npm run build

# Run linter
npm run lint
```

## Success Indicators

✅ Seeds run without errors
✅ Server starts on port 5000
✅ Login returns access token
✅ Recommendations return users with scores
✅ Matched users have conversations
✅ Messages can be sent and received
✅ Admin can view analytics

## Next Steps

1. ✅ Run seeds
2. ✅ Test matching algorithm
3. ✅ Test chat features
4. ✅ Test admin panel
5. ✅ Explore Swagger docs
6. ✅ Import Postman collection
