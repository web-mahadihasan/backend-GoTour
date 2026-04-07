import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    env: string;
    port: string;
    host: string;
    clientUrl: string;
    mongodbUri: string;
    isDevelopment: boolean;
    isProduction: boolean;
    logLevel: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        'NODE_ENV',
        'PORT',
        'HOST',
        'CLIENT_URL',
        'MONGODB_URI',
    ]

    requiredEnvVariables.forEach(variable => {
        if (!process.env[variable]) {
            throw new Error(`Missing required environment variable: ${variable}`);
        }
    })

    return {
        env: process.env.NODE_ENV as string,
        port: process.env.PORT as string,
        host: process.env.HOST as string,
        clientUrl: process.env.CLIENT_URL as string,
        mongodbUri: process.env.MONGODB_URI as string,
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production',
        logLevel: process.env.LOG_LEVEL || 'info',
    };
}

const config = loadEnvVariables()

export default config;