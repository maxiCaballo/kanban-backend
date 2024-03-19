import { Board, Column, User } from '@/domain';

export class BoardEntity implements Board {
	constructor(
		public id: string,
		public name: string,
		public columns: Column[],
		public shared: boolean,
		public users: User[],
		public admin: User,
	) {}
}
