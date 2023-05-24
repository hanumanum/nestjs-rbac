import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';

export class CheckUserDto extends PickType(CreateUserDto, ["username", "password"] as const) { }