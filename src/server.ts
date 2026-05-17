import config from "./app/config/environment"
import connectToDatabase, { disconnectFromDatabase } from "./app/config/database"
import logger from "./app/utils/logger"
import app from "./app"
import { Server } from "http";

let server: Server;

const startServer = async (): Promise<void> => {
    try {
        await connectToDatabase()

        server = app.listen(config.PORT, () => {
            logger.info(`Server running in ${config.PORT}`)
        })
    } catch (error) {
        logger.error("Server startup failed: " + (error instanceof Error ? error.message : String(error)))
        process.exit(1)
    }
}

// self call server start function
(async () => {
    startServer()
})()

const shutdownServer = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    if (server) {
        server.close(async () => {
            await disconnectFromDatabase(); 
            logger.info("Server closed.")
            process.exit(1)
        })
    }
    setTimeout(() => {
        logger.error('Force shutdown after timeout.')
        process.exit(1)
    }, 3000)
}

// SIGINT - 
process.on("SIGINT", () => {
    shutdownServer('SIGINT')
})

// SIGTERM
process.on("SIGTERM", () => {
    shutdownServer('SIGTERM')
})

// Unhandled rejection error
process.on("unhandledRejection", (error) => {
    logger.error("Unhandled rejection: " + (error instanceof Error ? error.message : String(error)))
    shutdownServer('unhandledRejection')
})

// Uncaught exception error
process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception: " + (error instanceof Error ? error.message : String(error)))
    shutdownServer('uncaughtException')
})