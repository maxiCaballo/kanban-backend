import { CustomError, IDeleteTaskDto, isValidId } from '@/domain';

export class DeleteTaskDto implements IDeleteTaskDto {
	private constructor(public boardId: string, public taskId: string, public userId: string) {}

	static create(object: { [key: string]: any }): { error?: CustomError; deleteTaskDto?: DeleteTaskDto } {
		const { boardId, taskId, userId } = object;

		if (!isValidId(boardId)) {
			return {
				error: CustomError.badRequest('Invalid board ID'),
			};
		}
		if (!isValidId(taskId)) {
			return {
				error: CustomError.badRequest('Invalid task ID'),
			};
		}

		if (!isValidId(userId)) {
			return {
				error: CustomError.badRequest('Invalid user ID'),
			};
		}
		return {
			deleteTaskDto: new DeleteTaskDto(String(boardId), String(taskId), String(userId)),
		};
	}
}
