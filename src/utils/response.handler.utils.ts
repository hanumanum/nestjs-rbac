import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//TODO: review all this shit
@Injectable()
export class ResponseHandlerService {
	private messeges: any = {}
	private showErrorStack: boolean = false;

	constructor(private readonly configService: ConfigService) {
		this.messeges = configService.get('messages');
		this.showErrorStack = (configService.get('environment') === 'development');
	}

	dataPaginatedHandler = (res, data) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			data: data?.data,
			meta: data.meta
		});

	}

	dataHandler = (res, data) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			data: data
		});
	}

	createdHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.CREATED).send({
			code: HttpStatus.CREATED,
			message: `${entityTitle} ${this.messeges.itemCreated}`
		}
		);
	};

	updatedHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			message: `${entityTitle}`
		});
	};

	updatedAnswerHandler = (res, message: any, data?: any) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			message, data
		});
	};

	deletedHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			message: `${entityTitle} deleted`
		});
	};

	notFoundHandler = (res, entityTitle: string) => {
		return res.status(HttpStatus.NOT_FOUND).send({
			code: HttpStatus.NOT_FOUND,
			message: `${entityTitle} ${this.messeges.notFound}`
		});
	};

	errorHandler = (res, err: Error, message = "") => {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
			message: `${err.message} \n ${message}`,
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			error: (this.showErrorStack) ? err.stack : ""
		});
	};

	noUserHandler = (res) => {
		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			message: this.messeges.noSuchUser
		});
	};

	syncHandler = (res, what, isSuccess: number) => {
		const statusCode = isSuccess === 1 ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).send({
			code: statusCode,
			message: isSuccess ? `${what} ${this.messeges.syncedSuccessfully}` : `${this.messeges.cannotSync} ${what}`
		});
	};

	alreadySubmittedHandler = (res) => {
		return res.status(298).send({
			code: 298,
			message: this.messeges.alreadyAnswered
		});
	};

	appointmentCanceledHandler = (res) => {
		return res.status(297).send({
			code: 297,
			message: this.messeges.cancaledAppointment
		});
	};

	uuidTokenExpiredHandler = (res) => {
		return res.status(299).send({
			code: 299,
			message: this.messeges.tokenExpired
		});
	};

	telNumberRequiredHandler = (res) => {
		return res.status(400).send({
			code: 400,
			message: this.messeges.phoneRequired
		});
	}

	noQuestinnaireHandler = (res) => {
		return res.status(499).send({
			code: 499,
			message: this.messeges.noquestionnaire
		})

	}

	checkYourPhoneHandler = (res) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			message: this.messeges.checkYourPhone
		})
	}

	successHandler = (res, message) => {
		return res.status(HttpStatus.OK).send({
			code: HttpStatus.OK,
			message: message
		})
	}
}
