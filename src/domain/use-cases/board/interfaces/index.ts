import { Board, DeleteBoardDto, RegisterBoardDto } from '@/domain';

export interface BoardResponse {
	board: Board;
}

export interface IRegisterBoardUseCase {
	execute(registerBoardDto: RegisterBoardDto): Promise<BoardResponse>;
}
export interface IDeleteBoardUseCase {
	execute(deleteBoardDto: DeleteBoardDto): Promise<BoardResponse>;
}
