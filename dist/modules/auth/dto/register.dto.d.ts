import { ValidationOptions } from 'class-validator';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
export declare function IsPasswordConfirmed(validationOptions?: ValidationOptions): PropertyDecorator;
export declare class RegisterDto {
    fullName: string;
    gender: Gender;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}
