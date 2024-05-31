import { Task, CreateTaskDto, DeleteTaskDto, UpdateTaskDto } from '@/domain';

export interface TaskResponse {
	task: Task;
}

export interface ICreateTaskUseCase {
	execute(createTaskDto: CreateTaskDto): Promise<TaskResponse>;
}
export interface IDeleteTaskUseCase {
	execute(deleteTaskDto: DeleteTaskDto): Promise<TaskResponse>;
}
export interface IUpdateTaskUseCase {
	execute(updateTaskDto: UpdateTaskDto | Partial<UpdateTaskDto>): Promise<TaskResponse>;
}
