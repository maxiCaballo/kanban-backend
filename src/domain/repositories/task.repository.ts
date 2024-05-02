import { CreateTaskDto, Task } from '@/domain';

export abstract class TaskRepository {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
}
