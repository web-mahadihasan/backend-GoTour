import bcrypt from 'bcrypt'
import { model, Schema } from 'mongoose'
import type { IAuthProviders, IUser } from './user.interface'
import { USER_ROLES, USER_STATUS } from './user.interface'
import config from '@/config/environment'

// ─── Mongoose Schema ──────────────────────────────────────────────────────────
export const authProvidersSchema = new Schema<IAuthProviders>(
    {
        provider: {
            type: String,
            required: true,
        },
        providerId: {
            type: String,
            required: true,
        },
    },
    { _id: false },
)

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name must be at most 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.USER,
            message: '{VALUE} role is not found'
        },
        phone: {
            type: String,
            // required: [true, 'Phone number is required'],
            validate: {
                validator: function (v: string) {
                    return  /^(?:\+?880|0)1[3-9]\d{8}$/.test(v)
                },
                message: '{VALUE} is not a valid phone number'
            }
        },
        picture: {
            type: String,
            validate: {
                validator: function (v: string) {
                    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
                },
                message: '{VALUE} is not a valid image URL'
            }
        },
        authProviders: {
            type: [authProvidersSchema],
            default: [],
        },
        isActive: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.ACTIVE,
            message: '{VALUE} status is not found'
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
)

// ─── Pre-save Hook: Hash password ─────────────────────────────────────────────

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return
    this.password = await bcrypt.hash(this.password, Number(config.BCRYPT_SALT_ROUND))
})

// ─── Instance Method: Compare password ───────────────────────────────────────

userSchema.methods.comparePassword = async function (
    candidatePassword: string,
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

// ─── Model ────────────────────────────────────────────────────────────────────

const User = model<IUser>('User', userSchema)

export default User
