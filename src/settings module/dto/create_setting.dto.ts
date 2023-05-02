import { EnumSettingTypes } from '../entities/settings.entity';

export class CreateSettingDto {
	setting_name: string;
	setting_value: any;
	setting_type: EnumSettingTypes;
}
