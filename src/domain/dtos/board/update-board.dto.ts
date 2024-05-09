import { IUpdateBoardDto, Column, CustomError, deleteUndefinedProps } from '@/domain';

export class UpdateBoardDto implements IUpdateBoardDto {
	private constructor(
		public id: string | number, //Required
		public name?: string,
		public columns?: Column[],
		public shared?: boolean,
		public users?: string[],
		public admin?: string,
	) {}

	//Class methods
	static create(data: { [key: string]: any }): {
		error?: CustomError;
		updateBoardDto?: UpdateBoardDto | Partial<UpdateBoardDto>;
	} {
		const { id, name, columns, shared, users, admin } = data;

		//Id validations

		if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
			return {
				error: CustomError.badRequest('Invalid Id'),
			};
		}

		const onlyIdIsDefined = Object.keys(data).length === 1;
		if (onlyIdIsDefined) {
			return {
				error: CustomError.badRequest('Nothing to update'),
			};
		}

		//Ok
		const updateBoardDto = new UpdateBoardDto(id, name, columns, shared, users, admin);
		const anyPropIsUndefined = Object.values(updateBoardDto).some((valueProp) => valueProp === undefined);

		if (anyPropIsUndefined) {
			return {
				updateBoardDto: deleteUndefinedProps<UpdateBoardDto>(updateBoardDto),
			};
		}

		return {
			updateBoardDto,
		};
	}
}
