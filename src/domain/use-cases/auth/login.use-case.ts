import { JwtAdapter, Payload } from '@/config';
import {
	AuthRepository,
	CustomError,
	LoginDto,
	SignToken,
	ILoginUseCase,
	AuthResponseUseCase as Response,
} from '@/domain';

export class Login implements ILoginUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	async execute(loginDto: LoginDto): Promise<Response> {
		//Check if user exist
		const { id, email, name, lastname, boards } = await this.authRepository.login(loginDto); //User entity

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
