import { CreateRoleDto } from './create.role.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}