import { Injectable } from '@nestjs/common';
import { UsersService } from '../rbac module/user/user.service';
import { CheckUserDto } from '../rbac module/user/dto/check.user.dto';
import { TupleErrorOrData } from '../common/interfaces/service.interface';
import { errorLogger } from '../utils/logger.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService) { }

    //TODO: fix any TupleErrorOrData<any>
    async validateUser(checkUserDto: CheckUserDto) {
        const [error, user] = await this.usersService.checkUserPassword(checkUserDto);

        if (error) {
            errorLogger(error)
            return null
        }

        if (!user)
            return null

        const { password, ...result } = user;
        return result
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
