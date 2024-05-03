import { Board, DeleteBoardDto, RegisterBoardDto, Subtask, UpdateBoardDto, UpdateSubtaskDto } from '@/domain';

//Responses
export interface BoardResponse {
	board: Board;
}
export interface BoardsResponse {
	boards: Board[];
}
export interface SubtaskResponse {
	subtask: Subtask;
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
export interface IGetUserBoardsUseCase {
	execute(userId: string | number): Promise<BoardsResponse>;
}
export interface IUpdateBoardUseCase {
	execute(updateBoardDto: UpdateBoardDto, userId: string): Promise<BoardResponse>;
}
export interface IUpdateSubtaskUseCase {
	execute(updateSubtaskDto: UpdateSubtaskDto, userId: string): Promise<SubtaskResponse>;
}
