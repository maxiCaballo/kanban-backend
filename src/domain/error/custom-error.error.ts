import { Response } from 'express';

export class CustomError {
	private constructor(
		public readonly statusCode: number,
		public readonly message: string | string[],
		public readonly ok: false = false,
	) {}

	//Class methods
	static create(statusCode: number, message: string | string[]): CustomError {
		const customError = new CustomError(statusCode, message);

		return {
			ok: customError.ok,
			statusCode: customError.statusCode,
			message: customError.message,
		};
	}
	static badRequest(message: string | string[] = 'Bad request'): CustomError {
		return CustomError.create(400, message);
	}
	static unAuthorized(message: string = 'Unauthorized'): CustomError {
		return CustomError.create(401, message);
	}
	static forbidden(message: string = 'forbidden'): CustomError {
		return CustomError.create(403, message);
	}
	static notFound(message: string = 'Not found'): CustomError {
		return CustomError.create(404, message);
	}
	static internalServer(message: string = 'Internal server error'): CustomError {
		return CustomError.create(500, message);
	}
}
