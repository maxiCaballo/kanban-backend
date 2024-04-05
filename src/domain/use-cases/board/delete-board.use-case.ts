import { Board, DeleteBoardDto, IDeleteBoardUseCase, BoardRepository, BoardResponse } from '@/domain';

export class DeleteBoardUseCase implements IDeleteBoardUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(deleteBoardDto: DeleteBoardDto): Promise<BoardResponse> {
		const deletedBoard = await this.boardRepository.delete(deleteBoardDto);
		return {
			board: deletedBoard,
		};
	}
}
