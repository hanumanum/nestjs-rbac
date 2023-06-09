import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResponseHandlerService {
	private showErrorStack: boolean = false;

	constructor(private readonly configService: ConfigService) {
		this.showErrorStack = (configService.get('environment') === 'development');
	}

	dataPaginatedHandler = (res, data) => {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			data: data?.data,
			meta: data.meta
		});
	}

	dataHandler = (res, data) => {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			data: data
		});
	}

	registrationHandler = (res, text: string) => {
		return res.status(HttpStatus.CREATED).send({
			statusCode: HttpStatus.CREATED,
			message: `${text}`
		}
		);
	};

	createdHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.CREATED).send({
			statusCode: HttpStatus.CREATED,
			message: `${entityTitle} created`
		}
		);
	};

	updatedHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			message: `${entityTitle} updated`
		});
	};

	generalSuccessHandler = (res, message: string) => {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			message: message
		})
	}


	deletedHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			message: `${entityTitle} deleted`
		});
	};

	notFoundHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.NOT_FOUND).send({
			statusCode: HttpStatus.NOT_FOUND,
			message: `${entityTitle} not found`
		});
	};

	errorHandler = (res, err: Error, message = "") => {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
			message: `${err.message} \n ${message}`,
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			error: (this.showErrorStack) ? err.stack : ""
		});
	};

	schemeHandler = (res, scheme: any) => {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			scheme
		})
	}
}
