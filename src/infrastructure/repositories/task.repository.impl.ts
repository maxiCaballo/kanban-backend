import { CreateTaskDto, Task, TaskRepository, TaskDatasource, DeleteTaskDto, UpdateTaskDto } from '@/domain';

export class TaskRepositoryImpl implements TaskRepository {
	constructor(private readonly taskDatasource: TaskDatasource) {}

	createTask(createTaskDto: CreateTaskDto): Promise<Task[]> {
		return this.taskDatasource.createTask(createTaskDto);
	}
	deleteTask(taskId: string, boardId: string): Promise<Task> {
		return this.taskDatasource.deleteTask(taskId, boardId);
	}
	updateTask(updateTaskDto: UpdateTaskDto | Partial<UpdateTaskDto>): Promise<Task> {
		return this.taskDatasource.updateTask(updateTaskDto);
	}
	updateColumnTask(taskId: string, boardId: string, columnId: string): Promise<Task> {
		return this.taskDatasource.updateColumnTask(taskId, boardId, columnId);
	}
}
