import { MongoDb } from '@/data';
import mongoose from 'mongoose';

describe('app.ts', () => {
	afterAll(() => {
		mongoose.connection.close();
	});
	test('should connect to  Mongodb', async () => {
		const connected = await MongoDb.connect({
			dbName: process.env.MONGO_DB_NAME!,
			mongoUrl: process.env.MONGO_URL!,
		});

		expect(connected).toBeTruthy();
	});
});
