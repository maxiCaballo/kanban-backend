import 'module-alias/register';
import { Server } from '@/presentation/server';
import { envs } from '@/config';
import { AppRoutes } from '@/presentation/routes';

(() => {
	main();
})();

async function main() {
	const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });

	server.start();
}
