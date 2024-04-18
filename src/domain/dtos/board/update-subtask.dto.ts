import { CustomError, IUpdateSubtaskDto, deleteUndefinedProps } from '@/domain';

export class UpdateSubtaskDto implements IUpdateSubtaskDto {
	constructor(
		public readonly id: string | number,
		public readonly title?: string,
		public readonly isCompleted?: boolean,
	) {}

	static create(object: { [key: string]: any }): {
		error?: CustomError;
		updateSubtaskDto?: UpdateSubtaskDto | Partial<UpdateSubtaskDto>;
	} {
		const { id, title, isCompleted } = object;

		if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
			return {
				error: CustomError.badRequest('Invalid ID'),
			};
		}

		const onlyIdIsDefined = Object.keys(object).length === 1;
		if (onlyIdIsDefined) {
			return {
				error: CustomError.badRequest('Nothing to update'),
			};
		}
		//Ok
		const updateSubtaskDto = new UpdateSubtaskDto(id, title, isCompleted);
		const anyPropIsUndefined = Object.values(updateSubtaskDto).some((valueProp) => valueProp === undefined);

		if (anyPropIsUndefined) {
			return {
				updateSubtaskDto: deleteUndefinedProps<UpdateSubtaskDto>(updateSubtaskDto),
			};
		}

		return {
			updateSubtaskDto,
		};
	}
}
