import { CustomError, IUpdateSubtaskDto, deleteUndefinedProps, isValidId } from '@/domain';

export class UpdateSubtaskDto implements IUpdateSubtaskDto {
	private constructor(
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
		if (!isValidId(boardId)) {
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

		if (!isValidId(id)) {
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
