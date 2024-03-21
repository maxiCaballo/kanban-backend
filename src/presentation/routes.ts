import { Router } from 'express';
import { AuthRoutes, JwtMiddleware, UserRoutes } from '@/presentation';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/auth', AuthRoutes.routes);

		router.use(JwtMiddleware.validate);

		router.use('/api/users', UserRoutes.routes);

		return router;
	}
}
