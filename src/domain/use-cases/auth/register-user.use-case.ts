import { JwtAdapter } from '@/config';
import {
	RegisterUserDto,
	AuthRepository,
	CustomError,
	SignToken,
	IRegisterUserUseCase,
	AuthResponseUseCase as Response,
} from '@/domain';

export class RegisterUser implements IRegisterUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	async execute(registerUserDto: RegisterUserDto): Promise<Response> {
		//Create user
		const { id, email, name, lastname, boards } = await this.authRepository.register(registerUserDto); //User entity

		//Generate token
		const token = await this.signToken({ id }); //Default duration 2h

		if (!token) {
			throw CustomError.internalServer();
		}

		return {
			user: {
				id,
				name,
				lastname,
				email,
				boards,
			},
			token: token,
		};
	}
}
/*
export interface User {
	id: string;
	email: string;
	name: string;
	lastname: string;
	password: string;
	boards: string[];
}
*/
