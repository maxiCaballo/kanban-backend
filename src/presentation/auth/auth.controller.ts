import { Request, Response } from 'express';
import { RegisterUserDto, AuthRepository, CustomError, RegisterUser } from '@/domain';
import { JwtAdapter } from '@/config';

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

		const registerUser = new RegisterUser(this.authRepository); //Use case

		registerUser
			.execute(registerUserDto!)
			.then((userInfo) => res.status(201).json(userInfo))
			.catch((error) => {
				const customError = CustomError.handleError(error);
				res.status(customError.statusCode).json(customError);
			});
	};
}
