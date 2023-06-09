import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { getRouteList } from './rbac module/rbac.utils';
import { arrayLogger } from './utils/logger.utils';
import { ValidationError } from 'class-validator';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get('PORT');

	app.enableVersioning();
	app.useGlobalPipes(new ValidationPipe({
		exceptionFactory: (validationErrors: ValidationError[] = []) => {
			return new BadRequestException(
				validationErrors.map((error) => {
					return {
						field: error.property,
						error: Object.values(error.constraints)
					}
				}),
			);
		},
		whitelist: true,
		transform: true,
		//stopAtFirstError: true //TODO: is this a good idea?
	}));

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
			.addServer(`http://localhost:${port}/`)
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