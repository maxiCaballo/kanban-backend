import { Board, Column } from '@/domain';

export class BoardEntity implements Board {
	constructor(
		public id: string,
		public name: string,
		public columns: Column[],
		public shared: boolean,
		public users: string[],
		public admin: string,
	) {}

	//Mapper
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, columns = [], shared = false, users = [], admin } = object;

		if (!id || !_id) throw new Error('UserEntity.fromObject() => Missing id || _id');
		if (!name) throw new Error('UserEntity.fromObject() => Missing board name');
		if (!admin) throw new Error('UserEntity.fromObject() => Missing admin id');

		return new BoardEntity(id || _id, name, columns, shared, users, admin);
	}
}
