import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignRolesDto {
    @ApiProperty()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    role_ids: string[];
}