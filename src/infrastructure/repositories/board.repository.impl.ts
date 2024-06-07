import {
	Board,
	BoardRepository,
	RegisterBoardDto,
	BoardDatasource,
	DeleteBoardDto,
	UpdateBoardDto,
	Subtask,
	UpdateSubtaskDto,
} from '@/domain';

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
	getUserBoards(userId: string | number): Promise<Board[]> {
		return this.boardDatasource.getUserBoards(userId);
	}
	updateBoard(updateBoardDto: UpdateBoardDto | Partial<UpdateBoardDto>): Promise<Board> {
		return this.boardDatasource.updateBoard(updateBoardDto);
	}
}
