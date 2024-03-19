import { User } from '@/domain';

export class UserEntity implements User {
	constructor(
		public id: string,
		public email: string,
		public name: string,
		public lastName: string,
		public password: string,
		public boards: string[],
	) {}
}
