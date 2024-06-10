import { GetBoardUseCase } from '../board/get-board.use-case';
import { DeleteTaskDto, IDeleteTaskUseCase, TaskResponse, TaskRepository, CustomError, BoardEntity } from '@/domain';

export class DeleteTaskUseCase implements IDeleteTaskUseCase {
	constructor(private readonly getBoardUseCase: GetBoardUseCase, private readonly taskRepository: TaskRepository) {}

	async execute(deleteTaskDto: DeleteTaskDto): Promise<TaskResponse> {
		const { boardId, taskId, userId } = deleteTaskDto;

		try {
			const { board } = await this.getBoardUseCase.execute(boardId, userId);

			const task = BoardEntity.getTaskById(board, taskId);

			if (!task) {
				throw CustomError.notFound('Task not found');
			}

			const deletedTask = await this.taskRepository.deleteTask(taskId, boardId);

			if (!deletedTask) {
				throw CustomError.internalServer();
			}

			return {
				task: deletedTask,
			};
		} catch (error) {
			throw error;
		}
	}
}
