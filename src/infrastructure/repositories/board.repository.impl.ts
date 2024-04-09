import { Board, BoardRepository, RegisterBoardDto, BoardDatasource, DeleteBoardDto } from '@/domain';

export class BoardRepositoryImpl implements BoardRepository {
	constructor(private readonly boardDatasource: BoardDatasource) {}

	create(registerBoardDto: RegisterBoardDto): Promise<Board> {
		return this.boardDatasource.create(registerBoardDto);
	}
	delete(deleteBoardDto: DeleteBoardDto): Promise<Board> {
		return this.boardDatasource.delete(deleteBoardDto);
	}
	getBoard(boardId: string | number): Promise<Board> {
		return this.boardDatasource.getBoard(boardId);
	}
}
