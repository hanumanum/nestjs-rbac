import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create.user.dto';

export class CheckUserDto extends PickType(CreateUserDto, ["username", "password"] as const) {}