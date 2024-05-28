import { Board, IGetUserBoardsUseCase, BoardRepository, BoardsResponse, BoardEntity } from '@/domain';

export class GetUserBoards implements IGetUserBoardsUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(userId: string | number): Promise<BoardsResponse> {
		const boards = (await this.boardRepository.getUserBoards(userId)) as BoardEntity[];

		//This verification is for security reasons if db fail
		const filteredBoards = boards.filter((board) => {
			const { isAdmin, isMember } = BoardEntity.isMemberOrAdminByUserId(board, userId);

			if (!isAdmin && !isMember) {
				return false;
			}

			return board;
		});

		return { boards: filteredBoards };
	}
}
