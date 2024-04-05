import { RegisterBoardDto, DeleteBoardDto, type Board } from '@/domain';
export abstract class BoardRepository {
	abstract create(registerBoardDto: RegisterBoardDto): Promise<Board>;
	abstract delete(deleteBoardDto: DeleteBoardDto): Promise<Board>;

	/*
    read
    update
    */
}
