import { IDeleteSubtaskDto, AnyObject } from '@/domain';

export class DeleteSubtaskDto implements IDeleteSubtaskDto {
	constructor(
		public readonly boardId: string | number,
		public readonly userId: string | number,
		public readonly subtaskId: string | number,
	) {}

	static create(object: AnyObject) {
		const { boardId, userId, subtaskId } = object;
	}
}
