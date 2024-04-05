import { Board, IRegisterBoardUseCase, RegisterBoardDto, BoardRepository } from '@/domain';

export class RegisterBoardUseCase implements IRegisterBoardUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(registerBoardDto: RegisterBoardDto): Promise<Board> {
		const board = await this.boardRepository.create(registerBoardDto);

		return board;
	}
}
