import { CustomError, IUpdateSubtaskDto, deleteUndefinedProps } from '@/domain';

export class UpdateSubtaskDto implements IUpdateSubtaskDto {
	constructor(
		public readonly boardId: string | number,
		public subtask: {
			id: string | number;
			title?: string;
			isCompleted?: boolean;
		},
	) {}

	static create(object: { [key: string]: any }): {
		error?: CustomError;
		updateSubtaskDto?: UpdateSubtaskDto | Partial<UpdateSubtaskDto>;
	} {
		//*Boardid
		const { boardId } = object;
		if (!boardId || (typeof boardId !== 'number' && typeof boardId !== 'string')) {
			return {
				error: CustomError.badRequest('Invalid ID'),
			};
		}

		const onlyBoardIdIsDefined = Object.keys(object).length === 1;
		if (onlyBoardIdIsDefined) {
			return {
				error: CustomError.badRequest('Nothing to update'),
			};
		}

		//*Subtask
		const { id } = object.subtask;

		if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
			return {
				error: CustomError.badRequest('Invalid ID'),
			};
		}

		const onlySubtaskIdIsDefined = Object.keys(object.subtask).length === 1;
		if (onlySubtaskIdIsDefined) {
			return {
				error: CustomError.badRequest('Nothing to update'),
			};
		}

		//*Ok
		const updateSubtaskDto = new UpdateSubtaskDto(boardId, object.subtask);
		const anyPropIsUndefined = Object.values(updateSubtaskDto.subtask).some((valueProp) => valueProp === undefined);

		if (anyPropIsUndefined) {
			const partialSubtask = deleteUndefinedProps<UpdateSubtaskDto>(updateSubtaskDto);
			updateSubtaskDto.subtask = {
				id,
				...partialSubtask,
			};
			return {
				updateSubtaskDto,
			};
		}

		return {
			updateSubtaskDto,
		};
	}
}
