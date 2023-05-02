import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	file_name: string;

	file_url?: string;
}
