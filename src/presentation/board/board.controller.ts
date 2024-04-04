import { Request, Response } from 'express';
import { RegisterBoardDto, CustomError } from '@/domain';

export class BoardController {
	constructor(/*private readonly boardRepository: BoardRepository*/) {}

	registerBoard = async (req: Request, res: Response) => {
		const { error, registerUserDto } = RegisterBoardDto.create(req.body);

		if (error) {
			const customError = CustomError.handleError(error);
			return res.status(customError.statusCode).json(customError);
		}

		res.status(201).json(registerUserDto);
	};
}
