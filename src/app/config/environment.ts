import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    ENV: string;
    PORT: string;
    HOST: string;
    CLIENT_URL: string;
    MONGODB_URI: string;
    IS_DEVELOPMENT: boolean;
    IS_PRODUCTION: boolean;
    LOG_LEVEL: string;
    BCRYPT_SALT_ROUND: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    EXPRESS_SESSION_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    FRONTEND_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        'NODE_ENV',
        'PORT',
        'HOST',
        'CLIENT_URL',
        'MONGODB_URI',
        'BCRYPT_SALT_ROUND',
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPIRES',
        'JWT_REFRESH_SECRET',
        'JWT_REFRESH_EXPIRES',
        'EXPRESS_SESSION_SECRET',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL',
        'FRONTEND_URL',
    ]

    requiredEnvVariables.forEach(variable => {
        if (!process.env[variable]) {
            throw new Error(`Missing required environment variable: ${variable}`);
        }
    })

    return {
        ENV : process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        HOST: process.env.HOST as string,
        CLIENT_URL: process.env.CLIENT_URL as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
    };
}

const config = loadEnvVariables()

export default config;