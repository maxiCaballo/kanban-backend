import { Request, Response } from 'express';
import {
	RegisterBoardDto,
	BoardRepository,
	RegisterBoardUseCase,
	DeleteBoardDto,
	DeleteBoardUseCase,
	GetBoardUseCase,
	CustomError,
} from '@/domain';
import { controllerErrorResponse, controllerSuccessResponse } from '@/presentation';

//TODO: CASO DE USO OBTENER TABLERO POR ID
//TODO: CASO DE USO UPDATE BOARD

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
		const { id: userId } = req.body.tokenPayload;

		//Client error
		if (error) {
			controllerErrorResponse(res, error);
			return;
		}

		//Use case
		const deleteBoard = new DeleteBoardUseCase(this.boardRepository);

		deleteBoard
			.execute(deleteBoardDto!, userId)
			.then((deletedBoard) => controllerSuccessResponse(res, 200, deletedBoard))
			.catch((error) => controllerErrorResponse(res, error));
	};
	getBoard = async (req: Request, res: Response) => {
		const { id: boardId = false } = req.params;
		const userId = req.body.tokenPayload.id;

		//Client error
		if (!boardId) {
			const customError = CustomError.badRequest('Missing board id');
			controllerErrorResponse(res, customError);
			return;
		}

		const getBoard = new GetBoardUseCase(this.boardRepository);

		getBoard
			.execute(boardId, userId)
			.then((board) => controllerSuccessResponse(res, 200, board))
			.catch((error) => controllerErrorResponse(res, error));
	};
	getBoards = async (req: Request, res: Response) => {
		const { userId } = req.params;
	};
}
