import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }

@Injectable()
export class RBACGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const { user, method, path } = context.switchToHttp().getRequest();
        console.log(user, method, path)

        return true;
    }
}