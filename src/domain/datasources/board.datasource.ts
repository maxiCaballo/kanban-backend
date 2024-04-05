import { RegisterBoardDto, type Board } from '@/domain';
import { DeleteBoardDto } from '../dtos/board/delete-board.dto';
export abstract class BoardDatasource {
	abstract create(registerBoardDto: RegisterBoardDto): Promise<Board>;
	abstract delete(deleteBoardDto: DeleteBoardDto): Promise<Board>;

	/*
    read
    update
    */
}
