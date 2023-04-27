import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from './entities/user.scheme';
import { Module } from "@nestjs/common";
import { UsersService } from "./user.service";
import { UserController } from "./user.controller";
import { ResponseHandlerService } from "../utils/response.handler.utils";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }], 'nestrbam')
    ],

    providers: [UsersService, ResponseHandlerService],
    exports: [UsersService],
    controllers: [UserController]
})
export class UsersModule { }