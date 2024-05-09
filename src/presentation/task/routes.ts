import { Router } from 'express';
import { BoardDatasourceMongoImpl, TaskDatasourceMongoImpl, TaskRepositoryImpl } from '@/infrastructure';
import { TaskController } from '@/presentation';

export class TaskRoutes {
	static get routes(): Router {
		const router = Router();
		const boardMongoDatasource = new BoardDatasourceMongoImpl();
		const taskMongoDatasource = new TaskDatasourceMongoImpl(boardMongoDatasource);
		const taskRepository = new TaskRepositoryImpl(taskMongoDatasource);
		const taskController = new TaskController(taskRepository);

		router.post('/', taskController.createTask);
		router.delete('/', taskController.deleteTask);

		return router;
	}
}
