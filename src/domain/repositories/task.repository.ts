import { CreateTaskDto, Task, UpdateTaskDto, DeleteTaskDto } from '@/domain';

export abstract class TaskRepository {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
	abstract updateTask(updateTaskDto: UpdateTaskDto | Partial<UpdateTaskDto>): Promise<Task>;
	abstract deleteTask(taskId: string, boardId: string): Promise<Task>;
	abstract updateColumnTask(taskId: string, boardId: string, columnId: string): Promise<Task>;
}
