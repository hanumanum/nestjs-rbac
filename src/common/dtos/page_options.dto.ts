import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum EnumOrder {
	ASC = 'asc',
	DESC = 'desc'
}

export class PageOptionsDto {
	@ApiPropertyOptional({ enum: EnumOrder, default: EnumOrder.ASC })
	@IsEnum(EnumOrder)
	@IsOptional()
	readonly order?: EnumOrder = EnumOrder.ASC;

	@ApiPropertyOptional({
		minimum: 1,
		default: 1
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page?: number = 1;

	@ApiPropertyOptional({
		minimum: 1,
		maximum: 10000,
		default: 10
	})
	@Type(() => Number)
	@Max(10000)
	@Min(1)
	@IsInt()
	@IsOptional()
	readonly take?: number = 10;

	@ApiPropertyOptional()
	@IsOptional()
	filter?: string = '';

	get skip(): number {
		return (this.page - 1) * this.take;
	}
}