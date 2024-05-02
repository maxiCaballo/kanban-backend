import { Request, Response } from 'express';
import {
	RegisterBoardDto,
	BoardRepository,
	RegisterBoardUseCase,
	DeleteBoardDto,
	DeleteBoardUseCase,
	GetBoardUseCase,
	CustomError,
	GetUserBoards,
	UpdateBoardUseCase,
	UpdateBoardDto,
} from '@/domain';
import { controllerErrorResponse, controllerSuccessResponse } from '@/presentation';

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
		const { id: boardId = null } = req.params;
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
	getUserBoards = async (req: Request, res: Response) => {
		const loggedUser = req.body.tokenPayload.id;

		//Client error
		if (!loggedUser) {
			const customError = CustomError.badRequest('Missing user id');
			controllerErrorResponse(res, customError);
			return;
		}

		const getBoards = new GetUserBoards(this.boardRepository);

		getBoards
			.execute(loggedUser)
			.then((boards) => controllerSuccessResponse(res, 200, boards))
			.catch((error) => controllerErrorResponse(res, error));
	};
	updateBoard = async (req: Request, res: Response) => {
		const loggedUser = req.body.tokenPayload.id;

		//Client error
		if (!loggedUser) {
			const customError = CustomError.badRequest('Missing user id');
			controllerErrorResponse(res, customError);
			return;
		}

		const { error, updateBoardDto } = UpdateBoardDto.create(req.body);
		//Client error
		if (error) {
			controllerErrorResponse(res, error);
			return;
		}

		const updateBoard = new UpdateBoardUseCase(this.boardRepository);

		//Use case
		updateBoard
			.execute(updateBoardDto as UpdateBoardDto, loggedUser)
			.then((updatedBoard) => controllerSuccessResponse(res, 200, updatedBoard))
			.catch((error) => controllerErrorResponse(res, error));
	};
}
