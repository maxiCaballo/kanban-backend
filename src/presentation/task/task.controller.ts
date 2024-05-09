import { TaskRepository } from '@/domain';
import { Request, Response } from 'express';

export class TaskController {
	constructor(private readonly taskRepository: TaskRepository) {}

	createTask = async (req: Request, res: Response) => {
		const { id: userId } = req.body.tokenPayload;
	};

	deleteTask = async (req: Request, res: Response) => {};
}
