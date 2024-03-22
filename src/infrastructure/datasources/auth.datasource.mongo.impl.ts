import { AuthDatasource, CustomError, LoginDto, RegisterUserDto, User, UserEntity } from '@/domain';
import { BcryptAdapter } from '@/config';
import { UserModel } from '@/data';

export class AuthDatasourceMongoImpl implements AuthDatasource {
	async register(registerUserDto: RegisterUserDto): Promise<User> {
		const { name, email, password, lastname } = registerUserDto;

		try {
			//1. Verify if user exist
			const exist = await UserModel.findOne({ email });

			if (exist) {
				//? It would be convenient to display a more generic error, for security reasons.
				throw CustomError.badRequest('User alredy exist');
			}
			//2.Create new user and hash password(pre save mongo middleware),
			const newUser = await UserModel.create({
				name,
				lastname,
				email,
				password,
			});

			//3. Create entity
			return UserEntity.fromObject(newUser);
		} catch (error) {
			throw error;
		}
	}

	async login(loginDto: LoginDto): Promise<User> {
		const { email, password } = loginDto;

		try {
			//1. Verify if user not exist
			const exist = await UserModel.findOne({ email });

			if (!exist) {
				//? It would be convenient to display a more generic error, for security reasons.
				throw CustomError.badRequest('User not exist');
			}

			//. Verify if password match
			const userDb = exist;
			const isValidPassword = BcryptAdapter.compare(password, userDb.password);

			if (!isValidPassword) {
				//? It would be convenient to display a more generic error, for security reasons.
				throw CustomError.badRequest('Incorrect password');
			}

			//2. Create entity
			return UserEntity.fromObject(userDb);
		} catch (error) {
			throw error;
		}
	}
}
