import { Task, CreateTaskDto } from '@/domain';

export interface TaskResponse {
	task: Task;
}

export interface ICreateTaskUseCase {
	execute(createTaskDto: CreateTaskDto): Promise<TaskResponse>;
}
