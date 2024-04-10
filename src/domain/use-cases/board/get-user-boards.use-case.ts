import { Board, IGetUserBoards, BoardRepository, BoardsResponse, BoardEntity, CustomError } from '@/domain';

export class GetUserBoards implements IGetUserBoards {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(userId: string | number): Promise<BoardsResponse> {
		const boards = await this.boardRepository.getUserBoards(userId);

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
