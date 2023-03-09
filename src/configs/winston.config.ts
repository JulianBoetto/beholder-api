import {
    utilities as nestWinstonModuleUtilities,
    WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: WinstonModuleOptions = {
    levels: winston.config.npm.levels,
    level: 'verbose',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                nestWinstonModuleUtilities.format.nestLike(),
            ),
        }),
        new winston.transports.File({
            filename: 'application.log',
            dirname: 'logs',
            maxsize: 1024 * 1024,
            maxFiles: 1,
            tailable: true
        }),
    ],
};