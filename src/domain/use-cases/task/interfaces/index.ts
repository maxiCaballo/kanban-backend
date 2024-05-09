import { Task, CreateTaskDto, DeleteTaskDto } from '@/domain';

export interface TaskResponse {
	task: Task;
}

export interface ICreateTaskUseCase {
	execute(createTaskDto: CreateTaskDto): Promise<TaskResponse>;
}
export interface IDeleteTaskUseCase {
	execute(deleteTaskDto: DeleteTaskDto): Promise<TaskResponse>;
}
