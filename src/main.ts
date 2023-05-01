import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import {getRouteList} from './rbac/rbac.utils';
import { arrayLogger } from './utils/logger.utils';
//import expressListRoutes from 'express-list-routes';


async function bootstrap() {
	//await load();
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get('PORT');
	global.encKey = configService.get('encKey_iv_hex');

	app.enableVersioning();

	app.setGlobalPrefix('protected', {
		exclude: [{ path: '/public/auth/admin', method: RequestMethod.POST },
		]
	});

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
			.addServer(`http://localhost:${port}/protected`, 'Localhost Protected Calls')
			.addServer(`http://localhost:${port}/`, 'Localhost Public Calls')
			.addSecurity('x-user-meta', {
				type: 'apiKey',
				name: 'x-user-meta',
				in: 'header'
			})
			.build();
		const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
		SwaggerModule.setup('docs', app, document);
	}

	await app.listen(port);
	console.log(port);

	const routesList = getRouteList(app)
	arrayLogger(routesList, 'routesList')

}

bootstrap();