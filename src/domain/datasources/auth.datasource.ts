import { LoginDto, RegisterUserDto, type User } from '@/domain';

export abstract class AuthDatasource {
	abstract register(registerUserDto: RegisterUserDto): Promise<User>;
	abstract login(loginDto: LoginDto): Promise<User>;
}
