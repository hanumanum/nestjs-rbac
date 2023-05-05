import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, MaxLength, Min, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    username: string;

    @ApiProperty()
    @MinLength(8)
    @MaxLength(30)
    password: string;
}