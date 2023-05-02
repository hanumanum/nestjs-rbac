import { ApiProperty } from "@nestjs/swagger";

export class CreateFileDto {
	@ApiProperty()
	file_name: string;
}