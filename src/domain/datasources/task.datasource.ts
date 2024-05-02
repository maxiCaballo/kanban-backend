import { CreateTaskDto, Task } from '@/domain';

export abstract class TaskDatasource {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
}
