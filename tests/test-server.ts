import { Server, AppRoutes } from '@/presentation';
import { envs } from '@/config';

export const testServer = new Server({
	port: envs.PORT,
	routes: AppRoutes.routes,
});
