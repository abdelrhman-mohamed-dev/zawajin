# Frontend Gender-Based Profile Implementation Guide

This guide explains how to implement gender-specific profile fields in the frontend for the Zawajin matrimonial platform.

## Overview

The user's gender is set during registration and stored in the JWT token and user profile. Based on this gender, different profile fields and field options should be displayed.

## Getting User Gender

### From JWT Token
```typescript
// After login, decode the JWT token
import jwtDecode from 'jwt-decode';

interface JWTPayload {
  userId: string;
  email: string;
  gender: 'male' | 'female';
  // ... other fields
}

const token = localStorage.getItem('authToken');
const decoded = jwtDecode<JWTPayload>(token);
const userGender = decoded.gender; // 'male' or 'female'
```

### From User Profile API
```typescript
// GET /users/profile response
interface UserProfile {
  id: string;
  email: string;
  gender: 'male' | 'female';
  username?: string;
  // ... other fields
}

const response = await fetch('/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept-Language': 'ar' // or 'en'
  }
});
const profile: UserProfile = await response.json();
const userGender = profile.gender;
```

## Gender-Specific Field Options

### 1. Marital Status (maritalStatus)

**For Men**: Use these options:
```typescript
const maleMaritalStatuses = [
  { value: 'single', label: 'Single' },    // أعزب
  { value: 'married', label: 'Married' },  // متزوج
  { value: 'divorced', label: 'Divorced' }, // مطلق
  { value: 'widowed', label: 'Widowed' }   // أرمل
];
```

**For Women**: Use these options:
```typescript
const femaleMaritalStatuses = [
  { value: 'virgin', label: 'Virgin' },     // عذراء
  { value: 'married', label: 'Married' },   // متزوجة
  { value: 'divorced', label: 'Divorced' }, // مطلقة
  { value: 'widow', label: 'Widow' }        // أرملة
];
```

### 2. Beauty Field (beauty)

**For Men**: Use these options:
```typescript
const maleBeautyOptions = [
  { value: 'acceptable', label: 'Acceptable' },  // مقبول
  { value: 'average', label: 'Average' },        // متوسط
  { value: 'handsome', label: 'Handsome' }       // وسيم
];
```

**For Women**: Use these options:
```typescript
const femaleBeautyOptions = [
  { value: 'acceptable', label: 'Acceptable' },      // مقبول
  { value: 'average', label: 'Average' },            // متوسط
  { value: 'beautiful', label: 'Beautiful' },        // جميلة
  { value: 'very_beautiful', label: 'Very Beautiful' } // جميلة جدا
];
```

### 3. Polygamy Fields

**For Men**: Show both fields
```typescript
// acceptPolygamy - Boolean checkbox
<Checkbox
  name="acceptPolygamy"
  label="Do you accept polygamy?"
/>

// polygamyStatus - String (optional, for consistency)
<Select name="polygamyStatus">
  <option value="yes">Yes</option>
  <option value="no">No</option>
</Select>
```

**For Women**: Show polygamyStatus with 3 options
```typescript
<Select name="polygamyStatus" required>
  <option value="yes">Yes</option>                          // نعم
  <option value="no">No</option>                            // لا
  <option value="thinking">I need to think about it</option> // أحتاج للتفكير
</Select>
```

## React Implementation Example

### Complete Gender-Aware Profile Form

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';

interface ProfileFormData {
  username?: string;
  nationality?: string;
  placeOfResidence?: string;
  tribe?: string;
  maritalStatus?: string;
  numberOfChildren?: number;
  profession?: string;
  educationLevel?: string;
  natureOfWork?: string;
  financialStatus?: string;
  healthStatus?: string;
  religiosityLevel?: string;
  weight?: number;
  height?: number;
  skinColor?: string;
  beauty?: string;
  bodyColor?: string;
  hairColor?: string;
  hairType?: string;
  eyeColor?: string;
  houseAvailable?: boolean;
  bio?: string;
  marriageType?: string;
  acceptPolygamy?: boolean;
  polygamyStatus?: string;
  detailedProfile?: string;
}

const ProfileForm: React.FC = () => {
  const { user } = useAuth(); // Contains user.gender
  const [formData, setFormData] = useState<ProfileFormData>({});
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');

  // Gender-specific options
  const getMaritalStatusOptions = () => {
    if (user.gender === 'male') {
      return [
        { value: 'single', label: language === 'ar' ? 'أعزب' : 'Single' },
        { value: 'married', label: language === 'ar' ? 'متزوج' : 'Married' },
        { value: 'divorced', label: language === 'ar' ? 'مطلق' : 'Divorced' },
        { value: 'widowed', label: language === 'ar' ? 'أرمل' : 'Widowed' }
      ];
    } else {
      return [
        { value: 'virgin', label: language === 'ar' ? 'عذراء' : 'Virgin' },
        { value: 'married', label: language === 'ar' ? 'متزوجة' : 'Married' },
        { value: 'divorced', label: language === 'ar' ? 'مطلقة' : 'Divorced' },
        { value: 'widow', label: language === 'ar' ? 'أرملة' : 'Widow' }
      ];
    }
  };

  const getBeautyOptions = () => {
    const commonOptions = [
      { value: 'acceptable', label: language === 'ar' ? 'مقبول' : 'Acceptable' },
      { value: 'average', label: language === 'ar' ? 'متوسط' : 'Average' }
    ];

    if (user.gender === 'male') {
      return [...commonOptions,
        { value: 'handsome', label: language === 'ar' ? 'وسيم' : 'Handsome' }
      ];
    } else {
      return [...commonOptions,
        { value: 'beautiful', label: language === 'ar' ? 'جميلة' : 'Beautiful' },
        { value: 'very_beautiful', label: language === 'ar' ? 'جميلة جدا' : 'Very Beautiful' }
      ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Accept-Language': language
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Section 1: Basic Info */}
      <section>
        <h2>{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h2>

        <input
          type="text"
          name="username"
          placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'}
          value={formData.username || ''}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />

        <input
          type="text"
          name="nationality"
          placeholder={language === 'ar' ? 'الجنسية' : 'Nationality'}
          value={formData.nationality || ''}
          onChange={(e) => setFormData({...formData, nationality: e.target.value})}
        />

        <select
          name="maritalStatus"
          value={formData.maritalStatus || ''}
          onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
        >
          <option value="">
            {language === 'ar' ? 'اختر الحالة الاجتماعية' : 'Select Marital Status'}
          </option>
          {getMaritalStatusOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      {/* Section 2: Physical Attributes */}
      <section>
        <h2>{language === 'ar' ? 'الصفات الجسدية' : 'Physical Attributes'}</h2>

        <input
          type="number"
          name="weight"
          placeholder={language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
          value={formData.weight || ''}
          onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
        />

        <input
          type="number"
          name="height"
          placeholder={language === 'ar' ? 'الطول (سم)' : 'Height (cm)'}
          value={formData.height || ''}
          onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
        />

        <select
          name="beauty"
          value={formData.beauty || ''}
          onChange={(e) => setFormData({...formData, beauty: e.target.value})}
        >
          <option value="">
            {language === 'ar' ? 'اختر تقييم الجمال' : 'Select Beauty Rating'}
          </option>
          {getBeautyOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      {/* Section 3: Marriage Preferences - Gender-specific */}
      <section>
        <h2>{language === 'ar' ? 'تفضيلات الزواج' : 'Marriage Preferences'}</h2>

        <select name="marriageType">
          <option value="traditional">
            {language === 'ar' ? 'تقليدي' : 'Traditional'}
          </option>
          <option value="mesyar">
            {language === 'ar' ? 'مسيار' : 'Mesyar'}
          </option>
        </select>

        {/* Polygamy fields - Different for men vs women */}
        {user.gender === 'male' ? (
          <>
            <label>
              <input
                type="checkbox"
                name="acceptPolygamy"
                checked={formData.acceptPolygamy || false}
                onChange={(e) => setFormData({...formData, acceptPolygamy: e.target.checked})}
              />
              {language === 'ar' ? 'هل تقبل تعدد الزوجات؟' : 'Do you accept polygamy?'}
            </label>
          </>
        ) : (
          <select
            name="polygamyStatus"
            value={formData.polygamyStatus || ''}
            onChange={(e) => setFormData({...formData, polygamyStatus: e.target.value})}
          >
            <option value="">
              {language === 'ar' ? 'موقفك من تعدد الزوجات' : 'Your stance on polygamy'}
            </option>
            <option value="yes">{language === 'ar' ? 'نعم' : 'Yes'}</option>
            <option value="no">{language === 'ar' ? 'لا' : 'No'}</option>
            <option value="thinking">
              {language === 'ar' ? 'أحتاج للتفكير' : 'I need to think about it'}
            </option>
          </select>
        )}
      </section>

      <button type="submit">
        {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProfileForm;
```

## Vue.js Implementation Example

```vue
<template>
  <form @submit.prevent="updateProfile">
    <!-- Marital Status -->
    <select v-model="profile.maritalStatus">
      <option value="">{{ $t('select_marital_status') }}</option>
      <option
        v-for="option in maritalStatusOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Beauty -->
    <select v-model="profile.beauty">
      <option value="">{{ $t('select_beauty') }}</option>
      <option
        v-for="option in beautyOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Polygamy - Conditional rendering based on gender -->
    <div v-if="userGender === 'male'">
      <label>
        <input type="checkbox" v-model="profile.acceptPolygamy" />
        {{ $t('accept_polygamy') }}
      </label>
    </div>

    <div v-else>
      <select v-model="profile.polygamyStatus" required>
        <option value="">{{ $t('polygamy_status') }}</option>
        <option value="yes">{{ $t('yes') }}</option>
        <option value="no">{{ $t('no') }}</option>
        <option value="thinking">{{ $t('thinking') }}</option>
      </select>
    </div>

    <button type="submit">{{ $t('save') }}</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      profile: {},
      userGender: 'male' // Get from auth store
    };
  },
  computed: {
    maritalStatusOptions() {
      if (this.userGender === 'male') {
        return [
          { value: 'single', label: this.$t('single') },
          { value: 'married', label: this.$t('married') },
          { value: 'divorced', label: this.$t('divorced') },
          { value: 'widowed', label: this.$t('widowed') }
        ];
      } else {
        return [
          { value: 'virgin', label: this.$t('virgin') },
          { value: 'married', label: this.$t('married') },
          { value: 'divorced', label: this.$t('divorced') },
          { value: 'widow', label: this.$t('widow') }
        ];
      }
    },
    beautyOptions() {
      const common = [
        { value: 'acceptable', label: this.$t('acceptable') },
        { value: 'average', label: this.$t('average') }
      ];

      if (this.userGender === 'male') {
        return [...common, { value: 'handsome', label: this.$t('handsome') }];
      } else {
        return [
          ...common,
          { value: 'beautiful', label: this.$t('beautiful') },
          { value: 'very_beautiful', label: this.$t('very_beautiful') }
        ];
      }
    }
  },
  methods: {
    async updateProfile() {
      const response = await fetch('/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.token}`,
          'Accept-Language': this.$i18n.locale
        },
        body: JSON.stringify(this.profile)
      });

      if (response.ok) {
        this.$toast.success(this.$t('profile_updated'));
      }
    }
  }
};
</script>
```

## API Request Examples

### Male Profile Update
```json
PUT /users/profile
Headers:
  Authorization: Bearer <token>
  Accept-Language: ar
  Content-Type: application/json

{
  "username": "ahmed_khan",
  "nationality": "Saudi",
  "maritalStatus": "single",
  "beauty": "handsome",
  "acceptPolygamy": false,
  "polygamyStatus": "no",
  "weight": 75,
  "height": 180
}
```

### Female Profile Update
```json
PUT /users/profile
Headers:
  Authorization: Bearer <token>
  Accept-Language: en
  Content-Type: application/json

{
  "username": "fatima_ali",
  "nationality": "Egyptian",
  "maritalStatus": "virgin",
  "beauty": "beautiful",
  "polygamyStatus": "thinking",
  "weight": 60,
  "height": 165
}
```

## Validation Rules

### Frontend Validation
```typescript
const validateProfileByGender = (profile: ProfileFormData, gender: 'male' | 'female') => {
  const errors: Record<string, string> = {};

  // Validate marital status based on gender
  if (profile.maritalStatus) {
    const maleStatuses = ['single', 'married', 'divorced', 'widowed'];
    const femaleStatuses = ['virgin', 'married', 'divorced', 'widow'];

    if (gender === 'male' && !maleStatuses.includes(profile.maritalStatus)) {
      errors.maritalStatus = 'Invalid marital status for male';
    }

    if (gender === 'female' && !femaleStatuses.includes(profile.maritalStatus)) {
      errors.maritalStatus = 'Invalid marital status for female';
    }
  }

  // Validate beauty based on gender
  if (profile.beauty) {
    const maleBeauty = ['acceptable', 'average', 'handsome'];
    const femaleBeauty = ['acceptable', 'average', 'beautiful', 'very_beautiful'];

    if (gender === 'male' && !maleBeauty.includes(profile.beauty)) {
      errors.beauty = 'Invalid beauty option for male';
    }

    if (gender === 'female' && !femaleBeauty.includes(profile.beauty)) {
      errors.beauty = 'Invalid beauty option for female';
    }
  }

  // Women should use polygamyStatus, men can use acceptPolygamy
  if (gender === 'female' && !profile.polygamyStatus) {
    errors.polygamyStatus = 'Polygamy status is required for women';
  }

  return errors;
};
```

## Important Notes

1. **Gender is Immutable**: The gender field is set during registration and cannot be changed through the profile update route.

2. **All Fields Optional**: All profile fields are optional to allow gradual profile completion.

3. **Backend Validation**: The backend does NOT enforce gender-specific validation. The frontend is responsible for showing appropriate options.

4. **Language Support**: Always send `Accept-Language` header with either `en` or `ar`.

5. **Polygamy Fields**:
   - `acceptPolygamy` (boolean) - Legacy field, primarily for men
   - `polygamyStatus` (string enum) - New field with 3 options, primarily for women
   - Both can be sent in the same request

6. **Translation Keys**: Use the i18n files at `src/i18n/en/users.json` and `src/i18n/ar/users.json` for all field labels and validation messages.

## Testing Checklist

- [ ] Male user can select only male-appropriate marital statuses
- [ ] Female user can select only female-appropriate marital statuses
- [ ] Male user sees "handsome" option for beauty
- [ ] Female user sees "beautiful" and "very_beautiful" options
- [ ] Male user sees acceptPolygamy checkbox
- [ ] Female user sees polygamyStatus dropdown with 3 options
- [ ] Language switching works correctly (EN/AR)
- [ ] API requests include correct Accept-Language header
- [ ] Form validation prevents invalid gender-specific values
- [ ] Profile updates successfully with partial data
