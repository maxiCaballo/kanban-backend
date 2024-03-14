import 'module-alias/register';
import { Server } from '@/presentation/server';
import { envs } from '@/config';

(() => {
	main();
})();

async function main() {
	const server = new Server({ port: envs.PORT });

	server.start();
}
