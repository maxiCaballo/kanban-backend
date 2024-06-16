export abstract class UserDatasource {
	abstract userExist(userId: string): Promise<Boolean>;
}
