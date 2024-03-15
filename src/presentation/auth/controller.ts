import { RegisterUserDto } from '@/domain';
import { Request, Response } from 'express';

export class AuthController {
	constructor() {}

	loginUser = async (req: Request, res: Response) => {
		res.json('login user controller');
	};

	registerUser = async (req: Request, res: Response) => {
		const { error, registerUserDto } = await RegisterUserDto.create(req.body);

		if (!error?.ok) {
			// const { ok, message, statusCode } = customError!;
			res.status(error!.statusCode).json(error);
		}

		res.status(200).json(registerUserDto);
	};
}
