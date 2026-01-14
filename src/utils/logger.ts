import config from "@/config/environment";
import pino from "pino";

const logger = pino({
    level: config.logLevel,
    transport: !config.isProduction ? 
    {
        target: 'pino-pretty',
	    options: {
	    	colorize: true,
	    	translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
	    	ignore: 'pid,hostname',
	    },
    } : undefined
})

export default logger;