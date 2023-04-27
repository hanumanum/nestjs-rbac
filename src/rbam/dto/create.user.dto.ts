import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@ApiProperty()
    @IsNotEmpty()
    username:string;

    @ApiProperty()
    @IsNotEmpty()
    password:string;

    @ApiProperty()
    @IsNotEmpty()
    name:string;
}