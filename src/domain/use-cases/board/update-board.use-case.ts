import {
	BoardRepository,
	BoardResponse,
	IUpdateBoardUseCase,
	UpdateBoardDto,
	BoardEntity,
	CustomError,
} from '@/domain';

export class UpdateBoardUseCase implements IUpdateBoardUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(updateBoardDto: UpdateBoardDto | Partial<UpdateBoardDto>, userId: string): Promise<BoardResponse> {
		const { id } = updateBoardDto;
		try {
			const board = await this.boardRepository.getBoard(id!);
			const { isAdmin, isMember } = BoardEntity.isMemberOrAdminByUserId(board, userId);

			if (!isAdmin && !isMember) {
				throw CustomError.unAuthorized();
			}

			const updatedBoard = await this.boardRepository.updateBoard(updateBoardDto);

			return {
				board: updatedBoard,
			};
		} catch (error) {
			throw error;
		}
	}
}
