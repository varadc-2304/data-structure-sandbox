import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
});

// Password change validation schema
export const changePasswordSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

// External auth token validation schema
export const externalAuthSchema = z.object({
  encrypted_token: z.string()
    .min(1, 'Token is required')
    .max(2048, 'Token is too long')
    .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid JWT format'),
});

// User data validation schema for external auth
export const userDataSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  email: z.string().email('Invalid email format').max(255),
  name: z.string().max(255).optional(),
  prn: z.string().max(50).optional(),
  department: z.string().max(100).optional(),
  course: z.string().max(100).optional(),
  grad_year: z.string().max(4).optional(),
  role: z.enum(['student', 'admin', 'instructor']).default('student'),
  exp: z.number().int().positive('Token expiration must be a positive number'),
  iat: z.number().int().positive('Token issued at must be a positive number'),
  iss: z.string().max(255, 'Issuer must be less than 255 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ExternalAuthData = z.infer<typeof externalAuthSchema>;
export type UserData = z.infer<typeof userDataSchema>;