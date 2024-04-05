import { Request, Response } from 'express';
import { RegisterUserDto, AuthRepository, RegisterUser, LoginDto, Login } from '@/domain';
import { controllerErrorResponse, controllerSuccessResponse } from '@/presentation';

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	loginUser = async (req: Request, res: Response) => {
		const { error, loginDto } = LoginDto.create(req.body);

		//Client error
		if (error) {
			controllerErrorResponse(res, error);
			return;
		}

		const loginUser = new Login(this.authRepository); //Use case;

		loginUser
			.execute(loginDto!)
			.then((userInfo) => controllerSuccessResponse(res, 200, userInfo))
			.catch((error) => controllerErrorResponse(res, error));
	};

	registerUser = async (req: Request, res: Response) => {
		const { error, registerUserDto } = RegisterUserDto.create(req.body);

		//Client error
		if (error) {
			controllerErrorResponse(res, error);
			return;
		}

		//Use case
		const registerUser = new RegisterUser(this.authRepository);

		registerUser
			.execute(registerUserDto!)
			.then((userInfo) => controllerSuccessResponse(res, 201, userInfo))
			.catch((error) => controllerErrorResponse(res, error));
	};
}
