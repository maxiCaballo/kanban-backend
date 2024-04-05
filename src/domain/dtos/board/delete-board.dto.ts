import { IDeleteBoardDto } from '@/domain';
import { CustomError } from '../../error/custom-error.error';

export class DeleteBoardDto implements IDeleteBoardDto {
	constructor(public boardId: string | number) {}

	static create(data: { [key: string]: string }): { error?: CustomError; deleteBoardDto?: DeleteBoardDto } {
		const { id } = data;

		if (!id) return { error: CustomError.badRequest('Missing board id') };

		return {
			deleteBoardDto: new DeleteBoardDto(id),
		};
	}
}
