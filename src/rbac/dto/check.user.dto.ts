import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//TODO: use PartialType here
export class CheckUserDto {
    @ApiProperty({required:true})
    @IsNotEmpty()
    username:string;

    @ApiProperty({required:true})
    @IsNotEmpty()
    password:string;
}