export abstract class UserRepository {
	abstract userExist(userId: string): Promise<Boolean>;
}
