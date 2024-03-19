import { AuthRepository, RegisterUserDto, User } from '@/domain';
import { AuthDatasource } from '../../domain/datasource/auth.datasource';

export class AuthRepositoryImpl implements AuthRepository {
	constructor(private readonly authDatasource: AuthDatasource) {}

	register(registerUserDto: RegisterUserDto): Promise<User> {
		return this.authDatasource.register(registerUserDto);
	}
}
