import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ResponseHandlerService } from './utils/response.handler.utils';
import { MongooseModule } from '@nestjs/mongoose';
import { RBACModule } from './rbac module/rbac.module';
import { FilesModule } from './files module/files.module'; 
import { SettingsModule } from './settings module/settings.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		MongooseModule.forRootAsync({
			connectionName: 'nestrbac',
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>('MONGO_CONNECTION_STRING'),
			}),
		}),
		AuthModule,
		RBACModule,
		FilesModule,
		SettingsModule,
		AuthModule
	],
	providers: [
		AppService,
		ResponseHandlerService]
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//consumer.apply(AuthMiddleware).exclude('/public/(.*)').forRoutes('*');
	}
}
