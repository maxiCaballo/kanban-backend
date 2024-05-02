import {
	RegisterBoardDto,
	Subtask,
	UpdateSubtaskDto,
	DeleteBoardDto,
	UpdateBoardDto,
	type Board,
	Task,
} from '@/domain';
import { CreateTaskDto } from '../dtos/board/task/create-task.dto';
export abstract class BoardDatasource {
	abstract create(registerBoardDto: RegisterBoardDto): Promise<Board>;
	abstract delete(deleteBoardDto: DeleteBoardDto): Promise<Board>;
	abstract getBoard(boardId: string | number): Promise<Board>;
	abstract getUserBoards(userId: string | number): Promise<Board[]>;
	abstract updateBoard(updateBoardDto: UpdateBoardDto | Partial<UpdateBoardDto>): Promise<Board>;
	//Task
	abstract createTask(createTaskDto: CreateTaskDto): Promise<Task[]>;
	//Subtask
	abstract updateSubtask(subtask: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask>;
}
