import { RegisterBoardDto, type Board } from '@/domain';
import { DeleteBoardDto } from '../dtos/board/delete-board.dto';
import { UpdateBoardDto } from '../dtos/board/update-board.dto';
export abstract class BoardDatasource {
	abstract create(registerBoardDto: RegisterBoardDto): Promise<Board>;
	abstract delete(deleteBoardDto: DeleteBoardDto): Promise<Board>;
	abstract getBoard(boardId: string | number): Promise<Board>;
	abstract getUserBoards(userId: string | number): Promise<Board[]>;
	abstract updateBoard(updateBoardDto: UpdateBoardDto | Partial<UpdateBoardDto>): Promise<Board>;
}
