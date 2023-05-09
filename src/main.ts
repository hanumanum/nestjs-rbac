import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { getRouteList } from './rbac module/rbac.utils';
import { arrayLogger } from './utils/logger.utils';

async function bootstrap() {
	//await load();
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get('PORT');
	global.encKey = configService.get('ENCKEY_IV_HEX'); //TODO: review this

	app.enableVersioning();

	/* 
	app.setGlobalPrefix('private', {
		exclude: [
			{ path: '/v1/auth/login', method: RequestMethod.POST },
			{ path: '/v1/auth/profile', method: RequestMethod.GET },
		]
	}); */

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

	app.useStaticAssets('./public');
	app.setBaseViewsDir('./views');
	app.setViewEngine('ejs');

	if (configService.get('ENVIRONMENT') === 'development') {
		app.enableCors();

		const config = new DocumentBuilder()
			.setTitle('Nest RBAC with MongoDB API docs')
			.setDescription('API docs')
			.setVersion('1.0')
			//.addServer(`http://localhost:${port}/private`, 'Private Calls')
			.addServer(`http://localhost:${port}/`, 'Public Calls')
			.addBearerAuth(
				{
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					in: 'header'
				},
				'jwt',
			)
			.build();
		const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
		SwaggerModule.setup('docs', app, document);
	}

	await app.listen(port);
	console.log(port);

	const routesList = getRouteList(app)
	arrayLogger(routesList, 'routesList')

	global.routesList = routesList;
}

bootstrap();