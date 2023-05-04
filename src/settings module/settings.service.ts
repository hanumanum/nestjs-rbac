import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SetSettingDto as SettingSetDto } from './dto/set.setting.dto';
import { TupleErrorOrData } from '../common/interfaces/service.interface';
import { PageOptionsDto, TypeErrorOrPageDtoTuple } from '../common/dtos';
import { errorLogger } from '../utils/logger.utils';
import { listMongoCollectionWithPagination } from '../utils/mongo.utils';
import { Setting as Entity, SettingDocument as MongoDocument } from './entities/setting.scheme';

type searchKeys = keyof typeof Entity.prototype;

@Injectable()
export class SettingService {
	constructor(
		@InjectModel(Entity.name, "nestrbac")
		private readonly model: Model<MongoDocument>
	) { }

	async list(pageOptionsDto: PageOptionsDto, findFields: searchKeys[] = []): TypeErrorOrPageDtoTuple<MongoDocument> {
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

	async set(settingSetDto: SettingSetDto): TupleErrorOrData<MongoDocument> {
		try {
			const documents = await this.model.find().where({ setting_name: settingSetDto.setting_name }).exec();
			const settingData = {
				...settingSetDto,
				setting_type: Array.isArray(settingSetDto.setting_value) ? "array" : typeof settingSetDto.setting_value
			}

			if (documents.length === 0) {
				const newSetting = new this.model(settingData);
				const settingDoc = await newSetting.save();
				return [null, settingDoc];
			}

			await documents[0].updateOne(settingData);
			return [null, documents[0]]
		}
		catch (error) {
			errorLogger(error)
			return [error, null]
		}
	}

	async get(setting_name: string): TupleErrorOrData<MongoDocument> {
		try {
			const documents = await this.model.find().where({ setting_name: setting_name }).exec();
			return [null, documents[0]]
		}
		catch (error) {
			errorLogger(error)
			return [error, null]
		}
	}

}
