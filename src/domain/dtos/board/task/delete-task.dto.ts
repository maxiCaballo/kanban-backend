import { CustomError, IDeleteTaskDto, isValidId } from '@/domain';

export class DeleteTaskDto implements IDeleteTaskDto {
	private constructor(public boardId: string, public taskId: string) {}

	static create(object: { [key: string]: any }): { error?: CustomError; deleteTaskDto?: DeleteTaskDto } {
		const { boardId, taskId } = object;

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

		return {
			deleteTaskDto: new DeleteTaskDto(boardId, taskId),
		};
	}
}
