import { Router } from 'express';
import { AuthRoutes, JwtMiddleware, UserRoutes, BoardRoutes } from '@/presentation';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/auth', AuthRoutes.routes);

		router.use(JwtMiddleware.validate);

		router.use('/api/users', UserRoutes.routes);
		router.use('/api/board', BoardRoutes.routes);

		return router;
	}
}
