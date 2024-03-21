import { Request, Response } from 'express';
import { RegisterUserDto, AuthRepository, CustomError } from '@/domain';
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

		this.authRepository
			.register(registerUserDto!)
			.then(async (user) =>
				res.status(201).json({
					user,
					token: await JwtAdapter.generateToken({
						id: user.id,
					}),
				}),
			)
			.catch((error) => {
				const customError = CustomError.handleError(error);
				res.status(customError.statusCode).json(customError);
			});
	};
}
