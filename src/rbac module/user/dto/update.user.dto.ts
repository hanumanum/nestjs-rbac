import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ["username"] as const) { }