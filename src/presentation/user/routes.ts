import { Router } from 'express';
import { UserController } from '@/presentation';

export class UserRoutes {
	static get routes() {
		const router = Router();
		const userController = new UserController();

		router.get('/', userController.getUsers);
		router.get('/:id', userController.getUsers);

		return router;
	}
}
