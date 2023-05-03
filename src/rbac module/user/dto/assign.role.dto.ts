import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { TypeMongoId } from '../../common/types.common';

export class AssignRolesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    user_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    role_ids: TypeMongoId[];
}