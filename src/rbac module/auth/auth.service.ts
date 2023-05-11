import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { CheckUserDto } from '../user/dto/check.user.dto';
import { errorLogger } from '../../utils/logger.utils';
import { JwtService } from '@nestjs/jwt';
import { EnumFieldsFilterMode, ObjectTransformerLib } from '../../utils/object.transformers.lib';


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService) { }

    //Will called by LocalStrategy before this.login method
    async validateUser(checkUserDto: CheckUserDto) {
        try {
            const [error, user] = await this.usersService.checkUserPassword(checkUserDto);

            if (error) {
                errorLogger(error)
                return null
            }

            if (!user)
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

}
