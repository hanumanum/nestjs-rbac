import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../rbac module/user/user.service';
import { TypeAvliableMethods } from '../common/types.common';
import { Role } from '../rbac module/role/entities/role.scheme';

type PermissionRequest = {
    method: TypeAvliableMethods,
    path: string
}

//TODO: can be smarter, refactor later
const havePermission = (permissionRequest: PermissionRequest, rolesOfUser: Role[]): boolean => {
    for (const role of rolesOfUser) {
        if (role.title === "superadmin")
            return true

        console.log("permissionRequest.path", permissionRequest.path)

        
        for (const permission of role.permissions) {
            console.log(permission)
            //console.log(permission.method , permissionRequest.method, permission.route , permissionRequest.path)
            if (permission.method === permissionRequest.method.toLowerCase() && permission.route === permissionRequest.path) {
                return true
            }
        }
    }

    return false
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }

@Injectable()
export class RBACGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly userService: UsersService) {
        super()
    }

    async canActivate(context: ExecutionContext) {
        const { user, method, path } = context.switchToHttp().getRequest();
        console.log(user, method, path)

        const [error, userFromDb] = await this.userService.one(user.userId);

        if (error || !userFromDb)
            return false

        const perimt = havePermission({ method, path }, userFromDb.roles)
        return perimt;
    }
}