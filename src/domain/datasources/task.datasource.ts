import { CreateTaskDto, Task } from '@/domain';
import { DeleteTaskDto } from '../dtos/board/task/delete-task.dto';

export abstract class TaskDatasource {
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
	abstract deleteTask(deleteTaskDto: DeleteTaskDto): Promise<Task>;
}
