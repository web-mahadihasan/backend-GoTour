import mongoose from "mongoose"
import config from "./environment"
import logger from "@/utils/logger"

const connectToDatabase = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(config.mongodbUri)
        logger.info('MongoDB connected successfully')
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logger.error(`MongoDB connection failed: ${errorMessage}`)
        process.exit(1)
    }
}
export default connectToDatabase;