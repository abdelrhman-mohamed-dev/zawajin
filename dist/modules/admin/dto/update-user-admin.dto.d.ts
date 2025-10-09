export declare class UpdateUserAdminDto {
    fullName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    age?: number;
    gender?: string;
    location?: {
        city: string;
        country: string;
    };
    religiousPractice?: string;
    sect?: string;
    prayerLevel?: string;
    maritalStatus?: string;
    profession?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isActive?: boolean;
}
