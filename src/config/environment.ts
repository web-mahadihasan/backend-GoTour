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
        'JWT_ACCESS_EXPIRES'
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
    };
}

const config = loadEnvVariables()

export default config;