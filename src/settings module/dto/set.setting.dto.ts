import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetSettingDto {
    @ApiProperty()
    @IsNotEmpty()
    setting_name: string;

    @ApiProperty()
    @IsNotEmpty()
    setting_value: any;
}