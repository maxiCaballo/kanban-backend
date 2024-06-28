import { UserModel } from '@/data';
import { UserDatasource } from '@/domain';

export class UserDatasourceMongoImpl implements UserDatasource {
	async userExist(userId: string): Promise<Boolean> {
		try {
			const userExist = Boolean(await UserModel.exists({ _id: userId }));
			return userExist;
		} catch (error) {
			throw error;
		}
	}
}
