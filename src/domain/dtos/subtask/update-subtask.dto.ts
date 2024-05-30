import { CustomError, IFullSubtask, IUpdateSubtaskDto, deleteUndefinedProps, isValidId } from '@/domain';

type anyObject = { [key: string]: any };

export class UpdateSubtaskDto implements IUpdateSubtaskDto {
	private constructor(
		public readonly boardId: string | number,
		public subtask: {
			id: string | number;
			title?: string;
			isCompleted?: boolean;
		},
	) {}

	static create(object: anyObject): {
		error?: CustomError;
		updateSubtaskDto?: UpdateSubtaskDto;
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
		const { error, subtaskDto } = UpdateSubtaskDto.validateOnlySubtask(object.subtask);

		if (error) {
			return {
				error,
			};
		}

		//*Ok
		const updateSubtaskDto = new UpdateSubtaskDto(boardId, object.subtask);
		const somePropOfSubtaskIsUndefined = Object.values(updateSubtaskDto.subtask).some(
			(valueProp) => valueProp === undefined,
		);

		if (somePropOfSubtaskIsUndefined) {
			const partialSubtask = deleteUndefinedProps<UpdateSubtaskDto>(updateSubtaskDto);

			updateSubtaskDto.subtask = {
				id: subtaskDto?.id!,
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

	static formArray(objects: anyObject[]): {
		error?: CustomError;
		failedSubtask?: anyObject;
		updateSubtaskDtos?: UpdateSubtaskDto[];
	} {
		const updateSubtaskDtos = [];
		for (const object of objects) {
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(object);

			if (error) {
				return { error, failedSubtask: object };
			}

			updateSubtaskDtos.push(updateSubtaskDto!);
		}

		return { updateSubtaskDtos };
	}

	static validateOnlySubtask(object: anyObject): {
		error?: CustomError;
		subtaskDto?: IFullSubtask | Partial<IFullSubtask>;
	} {
		const { id } = object;

		if (!isValidId(id)) {
			return {
				error: CustomError.badRequest('Invalid ID'),
			};
		}

		const onlySubtaskIdIsDefined = Object.keys(object).length === 1;
		if (onlySubtaskIdIsDefined) {
			return {
				error: CustomError.badRequest('Nothing to update'),
			};
		}
		const { title, isCompleted } = object;

		if (typeof title !== 'string' && typeof title !== 'undefined') {
			return {
				error: CustomError.badRequest('Invalid subtask title'),
			};
		}

		if (typeof isCompleted !== 'boolean' && typeof isCompleted !== 'undefined') {
			return {
				error: CustomError.badRequest('Invalid subtask isCompleted'),
			};
		}

		const somePropsIsUdefined = Object.values({ id, title, isCompleted }).some((value) => value === undefined);

		if (somePropsIsUdefined) {
			const partialSubtask = deleteUndefinedProps<IFullSubtask>({ id, title, isCompleted });

			return {
				subtaskDto: partialSubtask,
			};
		}

		return {
			subtaskDto: {
				id,
				title,
				isCompleted,
			},
		};
	}
}
