import { CreateTaskDto, Task, TaskRepository, TaskDatasource } from '@/domain';

export class TaskRepositoryImpl implements TaskRepository {
	constructor(private readonly taskDatasource: TaskDatasource) {}

	createTask(createTaskDto: CreateTaskDto): Promise<Task[]> {
		return this.taskDatasource.createTask(createTaskDto);
	}
}
