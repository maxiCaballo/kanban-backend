import { Router } from 'express';
import { BoardController } from '@/presentation';
import { BoardDatasourceMongoImpl, BoardRepositoryImpl } from '@/infrastructure';

export class BoardRoutes {
	static get routes(): Router {
		const router = Router();
		const boardMongoDatasource = new BoardDatasourceMongoImpl();
		const boardRepository = new BoardRepositoryImpl(boardMongoDatasource);
		const boardController = new BoardController(boardRepository);

		router.post('/', boardController.registerBoard);
		router.delete('/:id', boardController.deleteBoard);
		router.get('/:id', boardController.getBoard); //Get one user board
		router.get('/:userId', boardController.getBoards); //Get all user board

		return router;
	}
}
