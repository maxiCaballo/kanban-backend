import { Board, BoardRepository, RegisterBoardDto, BoardDatasource } from '@/domain';

export class BoardRepositoryImpl implements BoardRepository {
	constructor(private readonly boardDatasource: BoardDatasource) {}

	create(registerBoardDto: RegisterBoardDto): Promise<Board> {
		return this.boardDatasource.create(registerBoardDto);
	}
}
