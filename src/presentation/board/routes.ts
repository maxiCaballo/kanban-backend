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
		router.get('/user', boardController.getUserBoards); //Get all user board
		router.get('/:id', boardController.getBoard); //Get one user board
		router.put('/', boardController.updateBoard); //Get one user board

		return router;
	}
}
