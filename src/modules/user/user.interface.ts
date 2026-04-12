import * as v from 'valibot'
import type { InferOutput } from 'valibot'

// ─── Role Enum ────────────────────────────────────────────────────────────────

export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user',
    GUIDE: 'guide',
} as const

export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BLOCKED: 'blocked',
} as const

export interface IAuthProviders {
    provider: string
    providerId: string
}
export const UserRoleSchema = v.picklist(
    Object.values(USER_ROLES) as ['super_admin', 'admin', 'guide', 'user'],
)
export const UserStatusSchema = v.picklist(
    Object.values(USER_STATUS) as ['active', 'inactive', 'blocked']
)

export type UserRole = InferOutput<typeof UserRoleSchema>

// ─── Valibot Schemas ──────────────────────────────────────────────────────────

export const CreateUserSchema = v.object({
    name: v.pipe(
        v.string('Name must be a string'),
        v.minLength(2, 'Name must be at least 2 characters'),
        v.maxLength(50, 'Name must be at most 50 characters'),
    ),
    email: v.pipe(
        v.string('Email must be a string'),
        v.email('Invalid email address'),
    ),
    password: v.optional(
    v.pipe(
        v.string('Password must be a string'),
        v.minLength(8, 'Password must be at least 8 characters'),

        v.regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
        v.regex(/[a-z]/, 'Must contain at least one lowercase letter'),
        v.regex(/\d/, 'Must contain at least one number'),
        v.regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
        'Must contain at least one special character'
        ),
    )
    ),
    phone: v.pipe(
        v.string('Phone must be a string'),
        v.regex(
            /^(?:\+?880|0)1[3-9]\d{8}$/,
            'Invalid phone number. Please use BD number (e.g. 01XXXXXXXXX or +8801XXXXXXXXX)',
        ),
    ),
    role: v.optional(UserRoleSchema, USER_ROLES.USER),
    picture: v.optional(
        v.pipe(
            v.string('Picture must be a string'),
            v.url('Invalid URL'),
        ),
    ),
    authProviders: v.optional(
        v.pipe(
            v.array(
                v.object({
                    provider: v.string('Provider must be a string'),
                    providerId: v.string('Provider ID must be a string'),
                }),
            ),
            v.maxLength(1, 'Only one auth provider is allowed'),
        ),
    ),
    isVerified: v.optional(
        v.boolean('isVerified must be a boolean'),
        false,
    ),
    isActive: v.optional(UserStatusSchema, 'active'),
    isDeleted: v.optional(v.boolean(), false)
})

export const UpdateUserSchema = v.partial(
    v.omit(CreateUserSchema, ['email']),
)

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export type TCreateUser = InferOutput<typeof CreateUserSchema>
export type TUpdateUser = InferOutput<typeof UpdateUserSchema>

export interface IUser extends TCreateUser {
    createdAt?: Date
    updatedAt?: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}
