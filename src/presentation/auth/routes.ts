import { Router } from 'express';
import { AuthController } from './controller';
import { AuthRepositoryImpl, AuthDatasourceImpl } from '@/infrastructure';

export class AuthRoutes {
	static get routes(): Router {
		const router = Router();
		const authDatasource = new AuthDatasourceImpl();
		const authRepository = new AuthRepositoryImpl(authDatasource);
		const authController = new AuthController(authRepository);

		router.post('/login', authController.loginUser);
		router.post('/register', authController.registerUser);

		return router;
	}
}
