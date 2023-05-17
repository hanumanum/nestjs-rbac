import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { CheckUserDto } from '../user/dto/check.user.dto';
import { errorLogger } from '../../utils/logger.utils';
import { JwtService } from '@nestjs/jwt';
import { EnumFieldsFilterMode, ObjectTransformerLib } from '../../utils/object.transformers.lib';
import { RegisterDto } from './dto/register.dto';
import { RoleService } from '../role/role.service';
import { defaultRoleTitle } from '../common/default.role';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly rolesService: RoleService,
        private readonly jwtService: JwtService) { }

    //Will be called by LocalStrategy before this.login method
    async validateUser(checkUserDto: CheckUserDto) {
        try {
            const [error, user] = await this.usersService.checkUserPassword(checkUserDto);

            if (error) {
                errorLogger(error)
                return null
            }

            if (!user || user.isEmailVerifyed === false)
                return null

            const result = new ObjectTransformerLib(user)
                .mongoToPureJSON()
                .filterFields(EnumFieldsFilterMode.remove, ["createdAt", "updatedAt", "__v", "password"])
                .getData();

            return result

        }
        catch (error) {
            errorLogger(error)
            return null
        }
    }

    async login(username: string) {
        const [error, user] = await this.usersService.oneByUsername(username);

        if (error || !user) {
            errorLogger(error)
            return null
        }

        const userRoles = new ObjectTransformerLib(user.roles)
            .mongoToPureJSON()
            .filterFields(EnumFieldsFilterMode.remove, ["createdAt", "updatedAt", "__v", "_id", "title"])
            .getData();

        const payload = { username: user.username, sub: user._id, roles: userRoles };
        return {
            access_token: this.jwtService.sign(payload),
            username: user.username,
            roles: userRoles
        };
    }

    async register(registerDto: RegisterDto) {
        try {
            const [error, user] = await this.usersService.create(registerDto);
            if (error) {
                errorLogger(error)
                return [error, null]
            }

            if (this.configService.get("IS_FIRST_RUN") === "false") {
                const [error_role, role] = await this.rolesService.oneByTitle(defaultRoleTitle);
                if (error_role) {
                    errorLogger(error_role)
                    return [error_role, null]
                }

                user.roles = [role._id]
                await user.save();
            }

            const result = new ObjectTransformerLib(user)
                .mongoToPureJSON()
                .filterFields(EnumFieldsFilterMode.remove, ["createdAt", "updatedAt", "__v", "password"])
                .getData();

            return [null, result]
        }
        catch (error) {
            errorLogger(error)
            return [error, null]
        }
    }

}
