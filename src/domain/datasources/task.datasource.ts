import { CreateTaskDto, Task, DeleteTaskDto, UpdateTaskDto } from '@/domain';

export abstract class TaskDatasource {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
	abstract deleteTask(deleteTaskDto: DeleteTaskDto): Promise<Task>;
	abstract updateTask(updateTaskDto: UpdateTaskDto): Promise<Task>;
}
