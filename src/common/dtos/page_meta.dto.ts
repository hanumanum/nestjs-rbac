import { ApiProperty } from '@nestjs/swagger';
//import { PageMetaDtoParameters } from '../interfaces/page.interface';
import { PageOptionsDto } from '../dtos/page_options.dto';

export interface PageMetaDtoParameters {
	pageOptionsDto: PageOptionsDto;
	itemCount: number;
}

export class PageMetaDto {
	@ApiProperty()
	readonly page: number;

	@ApiProperty()
	readonly take: number;

	@ApiProperty()
	readonly itemCount: number;

	@ApiProperty()
	readonly pageCount: number;

	@ApiProperty()
	readonly hasPreviousPage: boolean;

	@ApiProperty()
	readonly hasNextPage: boolean;

	constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
		this.page = pageOptionsDto.page;
		this.take = pageOptionsDto.take;
		this.itemCount = itemCount;
		this.pageCount = Math.ceil(this.itemCount / this.take);
		this.hasPreviousPage = this.page > 1;
		this.hasNextPage = this.page < this.pageCount;
	}
}
