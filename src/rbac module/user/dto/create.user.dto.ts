import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    name?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

}