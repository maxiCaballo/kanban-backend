import { Router } from 'express';
import { BoardController } from '@/presentation';
import { AuthRepositoryImpl, AuthDatasourceMongoImpl } from '@/infrastructure';

export class BoardRoutes {
	static get routes(): Router {
		const router = Router();
		// const authMongoDatasource = new AuthDatasourceMongoImpl();
		// const authRepository = new AuthRepositoryImpl(authMongoDatasource);
		const boardController = new BoardController();

		router.post('/', boardController.registerBoard);

		return router;
	}
}
