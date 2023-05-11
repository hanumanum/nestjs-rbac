import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from './user/entities/user.scheme';
import { Module } from "@nestjs/common";
import { UsersService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { ResponseHandlerService } from "../utils/response.handler.utils";
import { Role, RoleSchema } from "./role/entities/role.scheme";
import { RoleService } from "./role/role.service";
import { RoleController } from './role/role.controller';
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

const JWT_EXPIRATION_TIME = 4000;
const jwtFactory = {
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
            expiresIn: JWT_EXPIRATION_TIME,
        },
    }),
    inject: [ConfigService],
};

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }], 'nestrbac'),
        MongooseModule.forFeature([{
            name: Role.name,
            schema: RoleSchema
        }], 'nestrbac'),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync(jwtFactory),
    ],

    providers: [UsersService, RoleService, AuthService, ResponseHandlerService, LocalStrategy, JwtStrategy],
    exports: [UsersService, RoleService, AuthService],
    controllers: [UserController, RoleController, AuthController]
})
export class RBACModule { }