import { LoginDto, User, RegisterUserDto } from '@/domain';

export abstract class AuthDatasource {
	abstract register(registerUserDto: RegisterUserDto): Promise<User>;
	abstract login(loginDto: LoginDto): Promise<User>;
}
