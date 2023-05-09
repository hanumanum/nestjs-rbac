import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'SuperAdmin'})
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    username: string;

    @ApiProperty({example: 'Paww33##Word'})
    @MinLength(8)
    @MaxLength(30)
    password: string;
}