import { Controller, Delete, Get, Param, Patch, Put, Query, Res, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { mkdir, unlink } from 'fs';
import { PageDto, PageOptionsDto } from '../common/dtos';
import { EnumFieldsFilterMode, ObjectTransformerLib } from '../utils/object.transformers.lib';
import { ResponseHandlerService } from '../utils/response.handler.utils';
import { FilesService } from './files.service';
import { Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create_file.dto';
import { UpdateFileDto } from './dto/update_file.dto';
import { ValidateMongoIdPipe } from '../utils/mongo.utils';
import { log } from 'console';

@ApiSecurity('x-user-meta')
@Controller('files')
@ApiTags('Files')
export class FilesController {
	private readonly entityTitle = 'file';
	constructor(private readonly configService: ConfigService, private readonly filesService: FilesService, private readonly mh: ResponseHandlerService) { }

	private uploadDirectory = '';

	onModuleInit() {
		this.uploadDirectory = this.configService.get('filespath');
		mkdir(`./${this.uploadDirectory}`, { recursive: true }, (err) => {
			if (err) throw err;
		});
	}

	@UseInterceptors(FileInterceptor('file'))
	@Put()
	@Version('1')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file_name: { type: 'string' },
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	async createOne(@Body() body, @UploadedFile() file: Express.Multer.File, @Res() res) {
	
		const fileData = {
			file_url: file.filename,
			file_name: body.file_name
		};

		const [error] = await this.filesService.create(fileData);

		if (error)
			return this.mh.errorHandler(res, error, `cannot create ${this.entityTitle}`);

		return this.mh.createdHandler(res, this.entityTitle);
	}

	@Get()
	@Version('1')
	async getList(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
		const [error, pageDto] = await this.filesService.list(pageOptionsDto, ['file_url', 'file_name']);

		if (error)
			return this.mh.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);

		return this.mh.dataPaginatedHandler(res, pageDto)
	}

	@Get(':id')
	@Version('1')
	async getOne(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
		const [error, data] = await this.filesService.one(id);

		if (error)
			return this.mh.errorHandler(res, error, `cannot get ${this.entityTitle}`);
		if (!data)
			return this.mh.notFoundHandler(res, this.entityTitle);

		return this.mh.dataHandler(res, data)
	}

	@Delete(':id')
	@Version('1')
	async deleteOne(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
		const [error, , filePath] = await this.filesService.remove(id);

		if (error)
			return this.mh.errorHandler(res, error, `cannot delete ${this.entityTitle}`);

		return unlink(`${this.uploadDirectory}${filePath}`, async (err) => {
			if (err)
				return this.mh.errorHandler(res, err, `cannot delete ${this.entityTitle} from filesystem`);

			return this.mh.deletedHandler(res, this.entityTitle);
		});
	}

	@Version('1')
	@Patch(':id')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file_name: { type: 'string' },
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	async updateOne(@Param('id', ValidateMongoIdPipe) id: string, @Body() body: UpdateFileDto, @UploadedFile() file: Express.Multer.File, @Res() res) {
		const fileData = file ? { file_url: file.filename, file_name: body.file_name } : { file_name: body.file_name };

		const [error] = await this.filesService.update(id, fileData);

		if (error)
			return this.mh.errorHandler(res, error, `cannot update ${this.entityTitle}`);

		return this.mh.updatedHandler(res, this.entityTitle);
	}
}
