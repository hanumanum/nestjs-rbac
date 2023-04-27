import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page_meta.dto';

export class PageDto<T> {
	@IsArray()
	@ApiProperty({ isArray: true })
	data: T[];

	@ApiProperty({ type: () => PageMetaDto })
	readonly meta: PageMetaDto;

	constructor(data: T[], meta: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}

/* export type PageDtoOrError<T> = { pageDto: PageDto<T>; error: any }; */
export type TypeErrorOrPageDtoTuple<T> = Promise<[Error | null, PageDto<T> | null]>;
export type EntityOrError<T> = { data: T; error: any };
