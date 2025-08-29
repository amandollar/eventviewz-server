export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateTokens: (id: string, role: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const generateEmailVerificationToken: () => string;
export declare const generatePasswordResetToken: () => string;
export declare const validatePasswordStrength: (password: string) => {
    isValid: boolean;
    errors: string[];
};
export declare const validateEmail: (email: string) => boolean;
