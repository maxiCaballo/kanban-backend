import {
	type RegisterBoardDto,
	type UpdateBoardDto,
	type UpdateSubtaskDto,
	type Subtask,
	type Board,
	type DeleteBoardDto,
	BoardEntity,
	BoardDatasource,
	CustomError,
} from '@/domain';
import { BoardModel, MongoDb, UserModel } from '@/data';
import { LodashAdapter as _ } from '@/config';

//Reglas de negocio para hacer
//Al crear columnas chequear que no cree una con el mismo nombre

export class BoardDatasourceMongoImpl implements BoardDatasource {
	async create(registerBoardDto: RegisterBoardDto): Promise<Board> {
		const { name, admin: adminId } = registerBoardDto;

		const isValidMongoId = MongoDb.isValidMongoId(adminId);

		if (!isValidMongoId) {
			throw CustomError.badRequest('Invalid mongo id');
		}

		try {
			//1. Check if user exist
			const user = await UserModel.findById(adminId).populate('boards');

			if (!user) {
				console.log(`Not user found with id: ${adminId} -> boardDatsourceMongoImpl.create()`);
				throw CustomError.notFound('Error createing table: USER NOT FOUND');
			}

			//2. Check if exist boards with the same name for this user
			const userBoards = user.boards.map((board) => BoardEntity.fromObject(board));

			if (userBoards.length > 0) {
				userBoards.forEach(({ name: dbName }) => {
					if (dbName === name) {
						throw CustomError.badRequest('Board already exist with this name');
					}
				});
			}

			//3. Create new board in database, middleware in BoardModel register the board in User.boards
			const newBoard = await BoardModel.create({ name, admin: adminId });

			//4. Create Entity
			return BoardEntity.fromObject(newBoard);
		} catch (error) {
			throw error;
		}
	}
	async delete(deleteBoardDto: DeleteBoardDto): Promise<Board> {
		const { boardId } = deleteBoardDto;

		const isValidMongoId = MongoDb.isValidMongoId(boardId);

		if (!isValidMongoId) {
			throw CustomError.badRequest('Invalid mongo id');
		}

		try {
			//1. Delete board from database, middleware in BoardModel delete the board in User.boards
			const deletedBoard = await BoardModel.findByIdAndDelete({ _id: boardId });

			if (!deletedBoard) {
				throw CustomError.notFound(`Board not found`);
			}

			return BoardEntity.fromObject(deletedBoard);
		} catch (error) {
			throw error;
		}
	}
	async getBoard(boardId: string | number): Promise<Board> {
		const isValidMongoId = MongoDb.isValidMongoId(boardId);

		if (!isValidMongoId) {
			throw CustomError.badRequest('Invalid mongo id');
		}
		try {
			const boardDb = await BoardModel.findById(boardId);

			if (!boardDb) {
				throw CustomError.notFound('Board not found');
			}

			const board = BoardEntity.fromObject(boardDb);
			board.users = MongoDb.fromObjectId(board.users) as string[];

			return board;
		} catch (error) {
			throw error;
		}
	}
	async getUserBoards(userId: string | number): Promise<Board[]> {
		const isValidMongoId = MongoDb.isValidMongoId(userId);

		if (!isValidMongoId) {
			throw CustomError.badRequest('Invalid mongo id');
		}
		try {
			const user = await UserModel.findById(userId).populate('boards');

			if (!user) {
				throw CustomError.notFound();
			}

			const boardsDb = user.boards;

			const boards = boardsDb.map((board) => BoardEntity.fromObject(board));

			return boards;
		} catch (error) {
			throw error;
		}
	}
	async updateBoard(updateBoardDto: UpdateBoardDto | Partial<UpdateBoardDto> | Partial<Board>): Promise<Board> {
		const { id } = updateBoardDto;
		const isValidMongoId = MongoDb.isValidMongoId(id);

		if (!isValidMongoId) {
			throw CustomError.badRequest('Invalid mongo id');
		}

		const { admin, columns, name, users, shared } = updateBoardDto;

		const updateQuery: any = {
			columns,
			name,
			shared,
			admin,
		};

		try {
			if (users) {
				if (users.length > 0) {
					const boardAdminIdDb = await BoardModel.findOne({ _id: id }, { admin: 1 });

					if (!boardAdminIdDb) {
						throw CustomError.internalServer();
					}
					const boardAdminId = boardAdminIdDb.admin.toString();
					const filteredUsers = users.filter((user) => user !== boardAdminId);

					updateQuery.$addToSet = {
						users: { $each: filteredUsers },
					};
				} else updateQuery.users = [];
			}

			const updatedBoardDb = await BoardModel.findByIdAndUpdate(id, updateQuery, {
				new: true,
			});

			if (!updatedBoardDb) {
				throw CustomError.notFound();
			}

			return BoardEntity.fromObject(updatedBoardDb);
		} catch (error) {
			throw error;
		}
	}
}
