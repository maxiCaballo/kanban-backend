import { BoardResponse, IGetBoardUseCase, BoardRepository, BoardEntity, CustomError } from '@/domain';

export class GetBoardUseCase implements IGetBoardUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(boardId: string | number, userId: string | number): Promise<BoardResponse> {
		try {
			const board = await this.boardRepository.getBoard(boardId);

			const { isMember, isAdmin } = BoardEntity.isMemberOrAdminByUserId(board, userId);

			if (!isMember && !isAdmin) {
				throw CustomError.unAuthorized();
			}

			return {
				board,
			};
		} catch (error) {
			throw error;
		}
	}
}
