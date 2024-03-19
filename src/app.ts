import 'module-alias/register';
import { Server } from '@/presentation/server';
import { envs } from '@/config';
import { AppRoutes } from '@/presentation/routes';
import { MongoDb } from '@/data';

(() => {
	main();
})();

async function main() {
	await MongoDb.connect({
		dbName: envs.MONGO_DB_NAME,
		mongoUrl: envs.MONGO_URL,
	});
	const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });

	server.start();
}
