import { User } from '@/domain';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';

export abstract class AuthDatasource {
	abstract register(registerUserDto: RegisterUserDto): Promise<User>;
}
