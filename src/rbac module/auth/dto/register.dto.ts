import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'SuperAdmin' })
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    username: string;

    @ApiProperty({ example: 'Paww33##Word' })
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @ApiProperty({ example: 'm.mokyan@gaga.com' })
    @MinLength(8)
    @MaxLength(30)
    @IsEmail()
    email: string;
}