import { connect, disconnect, Types } from 'mongoose';

interface Options {
	mongoUrl: string;
	dbName: string;
}

export class MongoDb {
	static async connect(options: Options) {
		const { mongoUrl, dbName } = options;

		try {
			await connect(mongoUrl, {
				dbName,
			});
			console.log('Mongo connected');

			return true;
		} catch (error) {
			console.log('Mongo connection error');
			throw error;
		}
	}
	static async disconnect() {
		await disconnect();
	}

	static isValidMongoId(id: any) {
		return Types.ObjectId.isValid(id);
	}
}
