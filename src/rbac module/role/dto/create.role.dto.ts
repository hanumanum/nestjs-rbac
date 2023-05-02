import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { TypeRoutePersmission } from '../../common/types.common';

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: [{
            route: '/users',
            method: 'get',
        }]
    })
    @IsNotEmpty()
    @IsArray()
    permissions: TypeRoutePersmission[];
}