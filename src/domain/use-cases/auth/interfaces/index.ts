import { Payload } from '@/config';
import { User, RegisterUserDto, LoginDto } from '@/domain';

//Types
export type SignToken = (payload: Payload, duration?: string) => Promise<string | null>;
type UserResponse = Omit<User, 'password'>;

//Interfaces
export interface AuthResponseUseCase {
	user: UserResponse;
	token: string;
}

//Register
export interface IRegisterUserUseCase {
	execute(registerUserDto: RegisterUserDto): Promise<AuthResponseUseCase>;
}
//Login
export interface ILoginUseCase {
	execute(loginDto: LoginDto): Promise<AuthResponseUseCase>;
}
