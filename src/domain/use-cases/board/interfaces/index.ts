import { Board, DeleteBoardDto, RegisterBoardDto } from '@/domain';

export interface BoardResponse {
	board: Board;
}
export interface BoardsResponse {
	boards: Board[];
}

export interface IRegisterBoardUseCase {
	execute(registerBoardDto: RegisterBoardDto): Promise<BoardResponse>;
}
export interface IDeleteBoardUseCase {
	execute(deleteBoardDto: DeleteBoardDto, userId: string): Promise<BoardResponse>;
}
export interface IGetBoardUseCase {
	execute(boardId: string | number, userId: string | number): Promise<BoardResponse>;
}
export interface IGetUserBoards {
	execute(userId: string | number): Promise<BoardsResponse>;
}
