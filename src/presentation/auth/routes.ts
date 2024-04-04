import { Router } from 'express';
import { AuthController } from '@/presentation';
import { AuthRepositoryImpl, AuthDatasourceMongoImpl } from '@/infrastructure';

export class AuthRoutes {
	static get routes(): Router {
		const router = Router();
		const authMongoDatasource = new AuthDatasourceMongoImpl();
		const authRepository = new AuthRepositoryImpl(authMongoDatasource);
		const authController = new AuthController(authRepository);

		router.post('/login', authController.loginUser);
		router.post('/', authController.registerUser);

		return router;
	}
}
