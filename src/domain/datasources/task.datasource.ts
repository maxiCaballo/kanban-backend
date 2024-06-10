import { CreateTaskDto, Task, DeleteTaskDto, UpdateTaskDto } from '@/domain';

export abstract class TaskDatasource {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
	abstract deleteTask(taskId: string, boardId: string): Promise<Task>;
	abstract updateTask(updateTaskDto: UpdateTaskDto | Partial<UpdateTaskDto>): Promise<Task>;
	abstract updateColumnTask(taskId: string, boardId: string, columnId: string): Promise<Task>;
}
