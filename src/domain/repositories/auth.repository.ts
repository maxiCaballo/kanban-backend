import { User, RegisterUserDto, LoginDto } from '@/domain';

export abstract class AuthRepository {
	abstract register(registerUserDto: RegisterUserDto): Promise<User>;
	abstract login(loginDto: LoginDto): Promise<User>;
}
