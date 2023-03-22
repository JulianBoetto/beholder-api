import {
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from 'winston';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    // @Inject('winston') private logger: Logger

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            // this.logger.info(err?.message);
            throw new UnauthorizedException(err?.message);
        }

        return user;
    }
}