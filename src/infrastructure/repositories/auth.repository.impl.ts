import { AuthRepository, LoginDto, RegisterUserDto, User } from '@/domain';
import { AuthDatasource } from '../../domain/datasources/auth.datasource';

export class AuthRepositoryImpl implements AuthRepository {
	constructor(private readonly authDatasource: AuthDatasource) {}

	register(registerUserDto: RegisterUserDto): Promise<User> {
		return this.authDatasource.register(registerUserDto);
	}
	login(loginDto: LoginDto): Promise<User> {
		return this.authDatasource.login(loginDto);
	}
}
