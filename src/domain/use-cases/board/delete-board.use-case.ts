import { BoardModel } from '@/data';
import {
	DeleteBoardDto,
	IDeleteBoardUseCase,
	BoardRepository,
	BoardResponse,
	CustomError,
	BoardEntity,
} from '@/domain';

export class DeleteBoardUseCase implements IDeleteBoardUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(deleteBoardDto: DeleteBoardDto, userId: string): Promise<BoardResponse> {
		const { boardId } = deleteBoardDto;
		try {
			const board = await this.boardRepository.getBoard(boardId);
			const { isAdmin } = BoardEntity.isMemberOrAdminByUserId(board, userId);

			if (!isAdmin) {
				throw CustomError.unAuthorized(`You don't have permission to delete this board`);
			}

			const deletedBoard = await this.boardRepository.delete(deleteBoardDto);

			return {
				board: deletedBoard,
			};
		} catch (error) {
			throw error;
		}
	}
}
