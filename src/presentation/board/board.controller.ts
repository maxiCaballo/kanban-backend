import { Request, Response } from 'express';
import { RegisterBoardDto, CustomError, BoardRepository } from '@/domain';

export class BoardController {
	constructor(private readonly boardRepository: BoardRepository) {}

	registerBoard = async (req: Request, res: Response) => {
		const { error, registerUserDto } = RegisterBoardDto.create(req.body);

		if (error) {
			const customError = CustomError.handleError(error);
			return res.status(customError.statusCode).json(customError);
		}

		//Use case
		this.boardRepository
			.create(registerUserDto!)
			.then((boardEntity) => res.status(201).json(boardEntity))
			.catch((error) => {
				const customError = CustomError.handleError(error);
				return res.status(customError.statusCode).json(customError);
			});
	};
}
