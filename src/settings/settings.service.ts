import { Injectable } from '@nestjs/common';
import { errorLogger } from '../utils/logger.utils';
import { CreateSettingDto } from './dto/create_setting.dto';
import { EnumSettingTypes, SettingsEntity } from './entities/settings.entity';
//import { DateLib } from '../utils/date.lib.utils';

const convertToType = (value: string, datatype: EnumSettingTypes) => {
	if (datatype === EnumSettingTypes.DATE) return new Date(value);
	if (datatype === EnumSettingTypes.FLOAT) return parseFloat(value);
	if (datatype === EnumSettingTypes.INTEGER) return parseInt(value);
	if (datatype === EnumSettingTypes.OBJECT) return JSON.parse(value);
	if (datatype === EnumSettingTypes.STRING) return value;
};

const convertFromType = (value: any, datatype: EnumSettingTypes) => {
	//if (datatype === EnumSettingTypes.DATE) return DateLib.dateToMysqlDateTime(value);
	if (datatype === EnumSettingTypes.OBJECT) return JSON.stringify(value);

	return value;
};

@Injectable()
export class SettingsService {
	async set(setting: CreateSettingDto) {
		try {
			setting.setting_value = convertFromType(setting.setting_value, setting.setting_type);

			await SettingsEntity.upsert(setting, ['setting_name']);

			return [null, true];
		} catch (err) {
			errorLogger(err);
			return [err, null];
		}
	}

	async get(setting_name: string) {
		try {
			const data = await SettingsEntity.findOne({
				where: {
					setting_name: setting_name
				}
			});

			data.setting_value = convertToType(data.setting_value, data.setting_type);

			return [null, data];
		} catch (err) {
			errorLogger(err);
			return [err, null];
		}
	}
}
