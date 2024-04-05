import { Board, IRegisterBoardUseCase, RegisterBoardDto, BoardRepository, BoardResponse } from '@/domain';

export class RegisterBoardUseCase implements IRegisterBoardUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(registerBoardDto: RegisterBoardDto): Promise<BoardResponse> {
		const board = await this.boardRepository.create(registerBoardDto);

		return {
			board,
		};
	}
}
