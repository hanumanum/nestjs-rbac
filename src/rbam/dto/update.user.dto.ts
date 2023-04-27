import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//TODO: use PartialType here
export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    password:string;

    @ApiProperty()
    @IsNotEmpty()
    name:string;
}