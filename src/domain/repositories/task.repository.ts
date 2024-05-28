import { CreateTaskDto, Task, UpdateTaskDto, DeleteTaskDto } from '@/domain';

export abstract class TaskRepository {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
	abstract deleteTask(deleteTaskDto: DeleteTaskDto): Promise<Task>;
	abstract updateTask(updateTaskDto: UpdateTaskDto): Promise<Task>;
}
