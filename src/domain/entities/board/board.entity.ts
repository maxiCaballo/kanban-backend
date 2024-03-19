import { Board, Column, User } from '@/domain';

export class BoardEntity implements Board {
	constructor(
		public id: string,
		public name: string,
		public column: Column[],
		public shared: boolean,
		public user: User[],
		public admin: User,
	) {}
}
