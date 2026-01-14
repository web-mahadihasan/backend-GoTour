import dotenv from 'dotenv'

dotenv.config()

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '8000',
    host: process.env.HOST || 'localhost',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    mongodbUri: process.env.MONGODB_URI,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    logLevel: process.env.LOG_LEVEL || 'info',
} as const

export default config;