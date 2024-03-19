import { RegisterUserDto, AuthRepository, CustomError } from '@/domain';
import { Request, Response } from 'express';

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	loginUser = async (req: Request, res: Response) => {
		res.json('login user controller');
	};

	registerUser = async (req: Request, res: Response) => {
		const { error, registerUserDto } = RegisterUserDto.create(req.body);

		//Client error
		if (error) {
			res.status(error.statusCode).json(error);
		}

		this.authRepository
			.register(registerUserDto!)
			.then((user) => res.status(201).json(user))
			.catch((error) => {
				const customError = CustomError.handleError(error);
				res.status(customError.statusCode).json(customError);
			});
	};
}
