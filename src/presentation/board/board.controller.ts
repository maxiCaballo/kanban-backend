import { Request, Response } from 'express';
import { RegisterBoardDto, CustomError, BoardRepository, RegisterBoardUseCase } from '@/domain';

export class BoardController {
	constructor(private readonly boardRepository: BoardRepository) {}

	registerBoard = async (req: Request, res: Response) => {
		const { error, registerBoardDto } = RegisterBoardDto.create(req.body);

		if (error) {
			const customError = CustomError.handleError(error);
			return res.status(customError.statusCode).json(customError);
		}

		const createBoard = new RegisterBoardUseCase(this.boardRepository);

		//Use case
		createBoard
			.execute(registerBoardDto!)
			.then((boardEntity) => res.status(201).json(boardEntity))
			.catch((error) => {
				const customError = CustomError.handleError(error);
				return res.status(customError.statusCode).json(customError);
			});
	};
}
