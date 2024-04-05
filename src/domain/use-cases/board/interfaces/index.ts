import { Board, RegisterBoardDto } from '@/domain';

export interface IRegisterBoardUseCase {
	execute(registerBoardDto: RegisterBoardDto): Promise<Board>;
}
