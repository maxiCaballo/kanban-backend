import { UpdateSubtaskUseCase } from '../subtask/update-subtask.use-case';
import { BoardEntity, Subtask, UpdateSubtaskDto } from '@/domain';
import {
	UpdateTaskDto,
	IUpdateTaskUseCase,
	TaskResponse,
	GetBoardUseCase,
	TaskRepository,
	CustomError,
} from '@/domain';

export class UpdateTaskUseCase implements IUpdateTaskUseCase {
	constructor(
		private readonly getBoardUseCase: GetBoardUseCase,
		private readonly taskRepository: TaskRepository,
		private readonly updateSubtaskUseCase: UpdateSubtaskUseCase,
	) {}

	async execute(updateTaskDto: UpdateTaskDto | Partial<UpdateTaskDto>): Promise<TaskResponse> {
		const { boardId, userId, task } = updateTaskDto;

		try {
			const { board: boardDb } = await this.getBoardUseCase.execute(boardId!, userId!); //I know it is member or admin

			if (!boardDb) {
				throw CustomError.notFound('Board not found');
			}

			if (task!.status) {
				const columnExistOnBoard = Boolean(boardDb.getColumnsNames().find((columnName) => columnName === task!.status));

				if (!columnExistOnBoard) {
					throw CustomError.badRequest(`Column ${task!.status} do not exist on this board`);
				}
			}

			if (task!.users && task!.users.length > 0) {
				const usersOk = BoardEntity.isMemberOrAdminByUserIds(boardDb, task!.users);

				if (!usersOk) {
					throw CustomError.unAuthorized(`Invalid users`);
				}
			}

			const updatedTask = await this.taskRepository.updateTask({ boardId, task });

			const updatedSubtasks: Subtask[] = [];
			//If task have subtasks
			if (task!.subtasks && task!.subtasks.length > 0) {
				const { error, updateSubtaskDtos } = UpdateSubtaskDto.formArray(task!.subtasks);

				if (error) {
					throw error;
				}

				for (const subtaskDto of updateSubtaskDtos!) {
					const updatedSubtask = await this.updateSubtaskUseCase.execute(subtaskDto, String(userId));

					updatedSubtasks.push(updatedSubtask.subtask);
				}

				updatedTask.subtasks = [...updatedTask.subtasks, ...updatedSubtasks];
			}
			//If user want to change task column
			if (task!.status) {
				const newColumn = boardDb.getColumnByName(task!.status!);
				const oldColumn = boardDb.getColumnByTaskId(task!.id);

				if (!oldColumn || !newColumn) {
					throw CustomError.internalServer();
				}

				if (task!.status!.toLocaleLowerCase() !== oldColumn.name) {
					await this.taskRepository.updateColumnTask(task!.id, boardId!, newColumn.id);
				}
			}

			return {
				task: updatedTask,
			};
		} catch (error) {
			throw error;
		}
	}
}
