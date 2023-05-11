import { Module } from '@nestjs/common';
import { SettingService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './entities/setting.scheme';
import { ResponseHandlerService } from '../utils/response.handler.utils';
import { SettingController } from './settings.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Setting.name,
			schema: SettingSchema
		}], 'nestrbac'),
	],

	providers: [SettingService, ResponseHandlerService],
	controllers: [SettingController]
})
export class SettingsModule { }