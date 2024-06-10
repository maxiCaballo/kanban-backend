import { MongoDb, UserModel, BoardModel, seedData } from '@/data';
import { Types } from 'mongoose';
import { BoardEntity } from '@/domain';

export const mongoDbTest = {
	deleteAllData: async () => {
		await Promise.all([UserModel.deleteMany(), BoardModel.deleteMany()]);
	},
	insertFakeData: async () => {
		await UserModel.insertMany(seedData.users);
		await BoardModel.insertMany(seedData.boards);
	},
	connect: async () => {
		await MongoDb.connect({
			mongoUrl: process.env.MONGO_URL!,
			dbName: process.env.MONGO_DB_NAME!,
		});
	},
	disconnect: async () => {
		await MongoDb.disconnect();
	},
	getTaskById: async (boardId: string, taskId: string) => {
		try {
			const boardDb = await BoardModel.findById(boardId);
			const boardEntity = BoardEntity.fromObject(boardDb!);
			return boardEntity.getTaskById(taskId);
		} catch (error) {
			throw error;
		}
	},
};
