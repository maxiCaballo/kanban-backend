import { CreateTaskDto, Task, TaskRepository, TaskDatasource, DeleteTaskDto, UpdateTaskDto } from '@/domain';

export class TaskRepositoryImpl implements TaskRepository {
	constructor(private readonly taskDatasource: TaskDatasource) {}

	createTask(createTaskDto: CreateTaskDto): Promise<Task[]> {
		return this.taskDatasource.createTask(createTaskDto);
	}
	deleteTask(deleteTaskDto: DeleteTaskDto): Promise<Task> {
		return this.taskDatasource.deleteTask(deleteTaskDto);
	}
	updateTask(updateTaskDto: UpdateTaskDto): Promise<Task> {
		return this.updateTask(updateTaskDto);
	}
}
