import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ResponseHandlerService } from './utils/response.handler.utils';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './rbam/rbam.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		MongooseModule.forRootAsync({
			connectionName: 'nestrbam',
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>('MONGO_CONNECTION_STRING'),
			}),
		}),
		UsersModule
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
