import { envs } from '@/config';
import { MongoDb, UserModel, BoardModel, seedData } from '@/data';

(async () => {
	await MongoDb.connect({
		mongoUrl: envs.MONGO_URL,
		dbName: envs.MONGO_DB_NAME,
	});

	await main();
	await MongoDb.disconnect();
})();

async function main() {
	//Delete all
	await Promise.all([UserModel.deleteMany(), BoardModel.deleteMany()]);

	//Users
	const users = await UserModel.insertMany(seedData.users);
	const boards = await BoardModel.insertMany(seedData.boards);
}
