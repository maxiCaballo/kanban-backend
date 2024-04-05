import { Response } from 'express';
import { CustomError, AuthResponseUseCase as AuthResponse, BoardResponse } from '@/domain';

type ControllerResponse = AuthResponse | BoardResponse;

export const controllerErrorResponse = (res: Response, error: CustomError | any) => {
	if (!error) return;

	const customError = CustomError.handleError(error);
	return res.status(customError.statusCode).json(customError);
};

export const controllerSuccessResponse = (res: Response, statusCode: number, data: ControllerResponse) => {
	return res.status(statusCode).json({
		ok: true,
		statusCode,
		...data,
	});
};
