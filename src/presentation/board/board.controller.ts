import { Request, Response } from 'express';
import { RegisterBoardDto, BoardRepository, RegisterBoardUseCase, DeleteBoardDto, DeleteBoardUseCase } from '@/domain';
import { controllerErrorResponse, controllerSuccessResponse } from '@/presentation';

//TODO: VERIFICAR QUE EL QUE ESTA INTENTANDO BORRAR SEA EL ADMIN DEL TABLERO
//TODO:

export class BoardController {
	constructor(private readonly boardRepository: BoardRepository) {}

	registerBoard = async (req: Request, res: Response) => {
		const { error, registerBoardDto } = RegisterBoardDto.create(req.body);

		//Client error
		if (error) {
			controllerErrorResponse(res, error);
			return;
		}

		const createBoard = new RegisterBoardUseCase(this.boardRepository);

		//Use case
		createBoard
			.execute(registerBoardDto!)
			.then((boardEntity) => controllerSuccessResponse(res, 201, boardEntity))
			.catch((error) => controllerErrorResponse(res, error));
	};
	deleteBoard = async (req: Request, res: Response) => {
		const { error, deleteBoardDto } = DeleteBoardDto.create(req.params);

		//Client error
		if (error) {
			controllerErrorResponse(res, error);
			return;
		}

		//Use case
		const deleteBoard = new DeleteBoardUseCase(this.boardRepository);

		deleteBoard
			.execute(deleteBoardDto!)
			.then((deletedBoard) => controllerSuccessResponse(res, 200, deletedBoard))
			.catch((error) => controllerErrorResponse(res, error));
	};
}
