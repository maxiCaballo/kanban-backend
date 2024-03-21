import { AuthDatasource, CustomError, RegisterUserDto, User, UserEntity } from '@/domain';
import { UserModel } from '@/data';

export class AuthDatasourceMongoImpl implements AuthDatasource {
	async register(registerUserDto: RegisterUserDto): Promise<User> {
		const { name, email, password, lastname, boards } = registerUserDto;

		try {
			//1. Verify if user exist
			const exist = await UserModel.findOne({ email });

			if (exist) {
				//? Seria convieniente arrojar un error mas generico,por tema de seguridad
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
			return new UserEntity(newUser.id, email, name, lastname, password, boards);
		} catch (error) {
			throw error;
		}
	}
}
