import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from './user/entities/user.scheme';
import { Module } from "@nestjs/common";
import { UsersService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { ResponseHandlerService } from "../utils/response.handler.utils";
import { Role, RoleSchema } from "./role/entities/role.scheme";
import { RoleService } from "./role/role.service";
import { RoleController } from './role/role.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }], 'nestrbac'),
        MongooseModule.forFeature([{
            name: Role.name,
            schema: RoleSchema
        }], 'nestrbac')

    ],

    providers: [UsersService, RoleService, ResponseHandlerService],
    exports: [UsersService, RoleService],
    controllers: [UserController, RoleController]
})
export class RBACModule { }