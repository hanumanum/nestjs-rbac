import { Injectable } from '@nestjs/common';
import { PageOptionsDto, TypeErrorOrPageDtoTuple } from '../common/dtos';
import { IService, TupleErrorOrData } from '../common/interfaces/service.interface';
import { errorLogger } from '../utils/logger.utils';
import { listMongoCollectionWithPagination } from '../utils/mongo.utils';
import { CreateFileDto } from './dto/create_file.dto';
import { UpdateFileDto } from './dto/update_file.dto';
import { File, FileDocument } from './entities/files.scheme';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


type searchKeys = keyof typeof File.prototype;

//TODO: make generic service
@Injectable()
export class FilesService implements IService {
	constructor(@InjectModel(File.name, "nestrbac") private readonly model: Model<FileDocument>) { }

	async list(pageOptionsDto: PageOptionsDto, findFields: searchKeys[] = []): TypeErrorOrPageDtoTuple<FileDocument> {
		try {
			const [error, data] = await listMongoCollectionWithPagination(this.model, pageOptionsDto, findFields);

			if (error)
				return [error, null]

			return [null, data]

		}
		catch (err) {
			errorLogger(err)
			return [err, null]
		}

	}

	async create(createDto: CreateFileDto): TupleErrorOrData<FileDocument> {
		try {

			const createdDocument = new this.model(createDto);
			const doc = await createdDocument.save();
			return [null, doc];
		}
		catch (err) {
			errorLogger(err)
			return [err, null];
		}
	}


	async one(id: string): TupleErrorOrData<FileDocument> {
		try {
			const document = await this.model.findById(id).exec();
			return [null, document]
		}
		catch (err) {
			errorLogger(err)
			return [err, null]
		}
	}


	async remove(id: string): TupleErrorOrData<boolean> {
		try {
			const toRemove = await this.model.findById(id).exec() //findByIdAndDelete(id);
			const file_url = toRemove.file_url
			await toRemove.deleteOne()

			return [null, true, file_url]
		}
		catch (err) {
			errorLogger(err)
			return [err, null]
		}
	}

	async update(id: string, updateDto: UpdateFileDto): TupleErrorOrData<FileDocument> {
		try {
			const document = await this.model.findById(id).exec();
			await document.updateOne(updateDto);
			return [null, document]
		}
		catch (error) {
			errorLogger(error)
			return [error, null]
		}
	}

}
