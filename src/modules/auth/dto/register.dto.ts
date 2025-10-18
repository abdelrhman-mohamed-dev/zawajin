import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

// Custom decorator to validate password confirmation
export function IsPasswordConfirmed(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isPasswordConfirmed',
      validator: {
        validate: (value: any, args: any) => {
          return value === args.object.password;
        },
        defaultMessage: () => 'Passwords do not match / كلمات المرور غير متطابقة',
      },
    },
    validationOptions,
  );
}

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'أحمد محمد علي',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Full name must be a string / الاسم الكامل يجب أن يكون نص' })
  @MinLength(2, { message: 'Full name must be at least 2 characters / الاسم الكامل يجب أن يكون على الأقل حرفين' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters / الاسم الكامل يجب ألا يتجاوز 100 حرف' })
  fullName: string;



  @ApiProperty({
    description: 'User gender',
    example: 'male',
    enum: Gender,
  })
  @IsEnum(Gender, { message: 'Gender must be either male or female / الجنس يجب أن يكون ذكر أو أنثى' })
  gender: Gender;

  @ApiProperty({
    description: 'Valid email address',
    example: 'an.roooof@gmail.com',
  })
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address / يرجى إدخال عنوان بريد إلكتروني صحيح' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '1234567890',
  })
  @IsString({ message: 'Phone number must be a string / رقم الهاتف يجب أن يكون نص' })
  @Matches(/^[0-9]{8,15}$/, {
    message: 'Please provide a valid phone number / يرجى إدخال رقم هاتف صحيح',
  })
  phone: string;

  @ApiProperty({
    description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'MyPassword123',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string / كلمة المرور يجب أن تكون نص' })
  @MinLength(8, { message: 'Password must be at least 8 characters / كلمة المرور يجب أن تكون على الأقل 8 أحرف' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number / كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'MyPassword123',
  })
  @IsString({ message: 'Confirm password must be a string / تأكيد كلمة المرور يجب أن يكون نص' })
  @IsPasswordConfirmed()
  confirmPassword: string;
}