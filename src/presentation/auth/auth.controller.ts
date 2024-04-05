import { Request, Response } from 'express';
import { RegisterUserDto, AuthRepository, CustomError, RegisterUser, LoginDto, Login } from '@/domain';

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	loginUser = async (req: Request, res: Response) => {
		const { error, loginDto } = LoginDto.create(req.body);

		//Client error
		if (error) {
			const customError = error.formatError();
			return res.status(customError.statusCode).json(customError);
		}

		const loginUser = new Login(this.authRepository); //Use case;

		loginUser
			.execute(loginDto!)
			.then((userInfo) => res.status(200).json(userInfo))
			.catch((error) => {
				const customError = CustomError.handleError(error);
				return res.status(customError.statusCode).json(customError);
			});
	};

	registerUser = async (req: Request, res: Response) => {
		const { error, registerUserDto } = RegisterUserDto.create(req.body);

		//Client error
		if (error) {
			const customError = error.formatError();
			return res.status(customError.statusCode).json(customError);
		}

		//Use case
		const registerUser = new RegisterUser(this.authRepository);

		registerUser
			.execute(registerUserDto!)
			.then((userInfo) => res.status(201).json(userInfo))
			.catch((error) => {
				const customError = CustomError.handleError(error);
				return res.status(customError.statusCode).json(customError);
			});
	};
}
