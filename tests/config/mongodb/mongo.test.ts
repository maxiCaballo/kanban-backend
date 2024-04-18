import { MongoDb } from '@/data';

describe('app.ts', () => {
	afterAll(async () => {
		await MongoDb.disconnect();
	});
	test('should connect to  Mongodb', async () => {
		const connection = await MongoDb.connect({
			dbName: process.env.MONGO_DB_NAME!,
			mongoUrl: process.env.MONGO_URL!,
		});

		expect(connection).toBeTruthy();
	});
});
