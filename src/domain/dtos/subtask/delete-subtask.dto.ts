import { IDeleteSubtaskDto, AnyObject, isValidId, CustomError } from '@/domain';

export class DeleteSubtaskDto implements IDeleteSubtaskDto {
	constructor(
		public readonly boardId: string | number,
		public readonly userId: string | number,
		public readonly subtaskId: string | number,
	) {}

	static create(object: AnyObject): { error?: CustomError; deleteSubtaskDto?: DeleteSubtaskDto } {
		const { boardId, userId, subtaskId } = object;

		if (!isValidId(boardId)) {
			return {
				error: CustomError.badRequest('Invalid board ID'),
			};
		}
		if (!isValidId(userId)) {
			return {
				error: CustomError.badRequest('Invalid user ID'),
			};
		}

		if (!isValidId(subtaskId)) {
			return {
				error: CustomError.badRequest('Invalid subtask ID'),
			};
		}

		throw CustomError.badRequest();
	}
}
