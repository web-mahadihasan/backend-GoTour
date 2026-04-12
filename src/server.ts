import config from "./config/environment"
import connectToDatabase from "./config/database"
import logger from "./utils/logger"
import app from "./app"

const startServer = async (): Promise<void> => {
    try {
        await connectToDatabase()

        const server = app.listen(config.PORT, () => {
            logger.info(`Server running in ${config.PORT}`)
        })

        const shutdown = async (signal: string) => {
            logger.info(`${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                await connectToDatabase()
                logger.info("Server closed.")
                process.exit(1)
            })

            setTimeout(() => {
                logger.error('Force shutdown after timeout.')
                process.exit(1)
            }, 10000)
        }

        process.on('SIGINT', () => shutdown('SIGINT'))
        process.on('SIGTERM', () => shutdown('SIGTERM'))
        process.on('unhandledRejection', (error) => {
            logger.error("Unhandled rejection: " + (error instanceof Error ? error.message : String(error)))
            shutdown('unhandledRejection')
        })
    } catch (error) {
        logger.error("Server startup failed: " + (error instanceof Error ? error.message : String(error)))
        process.exit(1)
    }
}

startServer()