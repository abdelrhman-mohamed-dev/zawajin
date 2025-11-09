# Multi-Language (i18n) Support

The Zawaj-In API supports both English and Arabic languages through the `lang` query parameter.

## Usage

### Adding Language Parameter to Requests

You can add the `?lang=en` or `?lang=ar` query parameter to **any** endpoint to get responses in the desired language.

#### Examples:

**Login with English:**
```bash
POST http://localhost:3001/auth/login?lang=en
```

**Login with Arabic:**
```bash
POST http://localhost:3001/auth/login?lang=ar
```

**Register with English:**
```bash
POST http://localhost:3001/auth/register?lang=en
```

**Get Profile with Arabic:**
```bash
GET http://localhost:3001/users/profile?lang=ar
```

### Supported Languages

- `en` - English (default)
- `ar` - Arabic

### Default Behavior

If no `lang` parameter is provided:
1. The system will check the `Accept-Language` header
2. If no header is present, it defaults to English (`en`)

### Implementation Details

The `lang` query parameter is handled globally and doesn't need to be added to individual DTOs. The custom validation pipe (`CustomValidationPipe`) automatically allows this parameter across all endpoints.

### In Swagger Documentation

When testing in Swagger UI at `http://localhost:3001/api/docs`, you can add the `lang` parameter manually to any endpoint URL.

### Language Files

Translation files are located in:
- `/src/i18n/en/` - English translations
- `/src/i18n/ar/` - Arabic translations

### Using i18n in Controllers

Controllers can access the i18n context to return localized messages:

```typescript
import { I18n, I18nContext } from 'nestjs-i18n';

@Post('login')
async login(@Body() loginDto: LoginDto, @I18n() i18n: I18nContext) {
  const message = await i18n.t('auth.login.success');
  return { message };
}
```

### Adding the @ApiLangQuery() Decorator (Optional)

If you want to document the `lang` parameter in Swagger for specific endpoints, you can use the `@ApiLangQuery()` decorator:

```typescript
import { ApiLangQuery } from '../common/decorators/api-lang-query.decorator';

@Get('profile')
@ApiLangQuery() // This adds lang parameter to Swagger docs
@ApiBearerAuth('JWT-auth')
async getProfile(@Request() req) {
  // ...
}
```

This decorator is optional since the `lang` parameter works globally regardless of documentation.
