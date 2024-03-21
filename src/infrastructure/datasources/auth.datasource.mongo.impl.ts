import { AuthDatasource, CustomError, RegisterUserDto, User, UserEntity } from '@/domain';
import { UserModel } from '@/data';

export class AuthDatasourceMongoImpl implements AuthDatasource {
	async register(registerUserDto: RegisterUserDto): Promise<User> {
		try {
			const { name, email, password, lastName } = registerUserDto;
			console.log(name);

			const boards = ['board1', 'board2'];

			//1. Verificar si existe el usuario por el email
			try {
				const userDb = await UserModel.findOne({ email });
			} catch (error) {}
			//2. Hash de contraseña
			//3. Mapear la respuesta a nuestra entidad

			return new UserEntity('1', email, name, lastName, password, boards);
		} catch (error) {
			console.log(error);
			throw CustomError.handleError(error);
		}
	}
}
