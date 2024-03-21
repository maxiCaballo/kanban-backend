import { User } from '@/domain';

export class UserEntity implements User {
	constructor(
		public id: string,
		public email: string,
		public name: string,
		public lastname: string,
		public password: string,
		public boards: string[] = [],
	) {}

	//Mapper
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, email, lastname, password, boards = [] } = object;

		if (!id || !_id) throw new Error('UserEntity.fromObject() => Missing id || _id');
		if (!name) throw new Error('UserEntity.fromObject() => Missing name');
		if (!email) throw new Error('UserEntity.fromObject() => Missing email');
		if (!lastname) throw new Error('UserEntity.fromObject() => Missing lastname');
		if (!password) throw new Error('UserEntity.fromObject() => Missing password');

		return new UserEntity(id || _id, name, lastname, email, password, boards);
	}
}

//Mapper∏
/*
 se refiere usualmente en la parte de infraestructura, a la labor de transformar un objeto a otro, el cual usualmente es de un objeto a una 
 entidad, esta capa nos ayuda a proteger nuestra lógica de cambios inesperados de la base de datos que van desde nuevas propiedades o 
 cambio de sus nombres
*/
