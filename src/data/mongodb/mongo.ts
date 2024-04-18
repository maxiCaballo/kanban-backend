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

	static isValidMongoId(data: any | any[]) {
		if (Array.isArray(data)) {
			return data.every((element) => Types.ObjectId.isValid(element));
		}
		return Types.ObjectId.isValid(data);
	}
	static fromObjectId(data: string[] | string) {
		if (!Array.isArray(data)) {
			return String(data);
		}
		return data.map((element) => String(element));
	}
}
