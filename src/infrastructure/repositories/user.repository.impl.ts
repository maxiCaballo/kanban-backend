import { UserDatasource, UserRepository } from '@/domain';

export class UserRepositoryImpl implements UserRepository {
	constructor(private readonly userDatasource: UserDatasource) {}

	userExist(userId: string) {
		return this.userDatasource.userExist(userId);
	}
}
