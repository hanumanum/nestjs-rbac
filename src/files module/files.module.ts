import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResponseHandlerService } from '../utils/response.handler.utils';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema, File } from './entities/files.scheme';
import { RBACModule } from '../rbac module/rbac.module';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: File.name,
			schema: FileSchema
		}], 'nestrbac'),
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				storage: diskStorage({
					destination: (_: any, __: any, cb: any) => {
						const directory = configService.get('UPLOAD_DIRECTORY');
						return cb(null, `./${directory}`);
					},
					filename: (_, file, cb) => {
						const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
						return cb(null, file.originalname.split('.').shift() + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
					}
				})
			}),
			inject: [ConfigService]
		}),
		RBACModule
	],
	controllers: [FilesController],
	providers: [FilesService, ResponseHandlerService]
})

export class FilesModule { }
