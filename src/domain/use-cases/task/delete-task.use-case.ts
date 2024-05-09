import {
	DeleteTaskDto,
	IDeleteTaskUseCase,
	TaskResponse,
	TaskRepository,
	BoardRepository,
	CustomError,
	BoardEntity,
} from '@/domain';

export class DeleteTaskUseCase implements IDeleteTaskUseCase {
	constructor(private readonly boardRepository: BoardRepository, private readonly taskRepository: TaskRepository) {}

	async execute(deleteTaskDto: DeleteTaskDto): Promise<TaskResponse> {
		const { boardId, taskId } = deleteTaskDto;

		try {
			const boardDb = await this.boardRepository.getBoard(boardId);

			const boardEntity = BoardEntity.fromObject(boardDb);

			const task = BoardEntity.getTaskById(boardEntity, taskId);

			if (!task) {
				throw CustomError.notFound('Task not found');
			}
		} catch (error) {}

		throw new Error('Method not implemented.');
	}
}
