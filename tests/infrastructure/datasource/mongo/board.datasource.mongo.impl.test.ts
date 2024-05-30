import { mongoDbTest } from '../../../helpers/mongo';
import { BoardModel, seedData } from '@/data';
import { LodashAdapter as _ } from '@/config';
import { UpdateBoardDto, BoardEntity, UpdateSubtaskDto, CustomError } from '@/domain';
import { BoardDatasourceMongoImpl } from '@/infrastructure';
import { Types } from 'mongoose';

describe('Test on BoardMongoDatasourceImpl', () => {
	const boardMongoDatasource = new BoardDatasourceMongoImpl();
	const mockBoardId = '65fba8a36ac699c0be9ffcd3';
	const mockAdminBoard = '65fb34bafd3f5c84bc4b1ed4';
	const mockBoard = {
		id: mockBoardId,
		name: 'New name',
		columns: [],
		shared: false,
		users: [],
		admin: mockAdminBoard,
	};

	//Update Dto
	const { updateBoardDto: mockUpdateBoardDto } = UpdateBoardDto.create(mockBoard);

	//Connect
	beforeAll(async () => {
		await mongoDbTest.connect();
	});
	//Clean database and insert test data
	beforeEach(async () => {
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();
	});
	//Close connection
	afterAll(async () => {
		//Delete all
		// await mongoDbTest.deleteAllData();
		await mongoDbTest.disconnect();
	});

	describe('UPDATE BOARD', () => {
		test('Should update completely a board', async () => {
			//Arrange
			const boardDb = await BoardModel.findById(mockBoard.id);
			const mockBoardDb = BoardEntity.fromObject(boardDb!);

			//Act
			const mockBoardUpdated = await boardMongoDatasource.updateBoard(mockUpdateBoardDto as UpdateBoardDto);

			//Assert
			expect(mockBoard.id).toEqual(mockBoardDb.id);
			expect(mockBoard).not.toEqual(mockBoardDb);
			expect(mockBoardUpdated).toBeInstanceOf(BoardEntity);
			expect(mockBoardUpdated).toEqual(mockBoard);
		});
	});
	describe('UPDATE SUBTASK', () => {
		//Errors
		test('Should throw an error if boardId is not a mongo id', async () => {
			// Arrange
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Invalid mongo id',
			};
			const mockSubtask = {
				id: '661ee7be53a30b492609cb66',
				title: 'Modify title',
				isCompleted: true,
			};
			const mockDto = {
				boardId: 'INVALID ID',
				subtask: mockSubtask,
			};

			// Act
			try {
				await boardMongoDatasource.updateSubtask(mockDto as UpdateSubtaskDto);
			} catch (error) {
				// Assert
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if subtask id is not a mongo id', async () => {
			// Arrange
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Invalid mongo id',
			};
			const mockSubtask = {
				id: 'INVALID ID',
				title: 'Modify title',
				isCompleted: true,
			};
			const mockDto = {
				boardId: '65fba8a36ac699c0be9ffcd3',
				subtask: mockSubtask,
			};

			// Act
			try {
				await boardMongoDatasource.updateSubtask(mockDto as UpdateSubtaskDto);
			} catch (error) {
				// Assert
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if board do not exist', async () => {
			//Arrange
			const nonExistBoardId = new Types.ObjectId().toString();
			const updateSubtaskDto = {
				boardId: nonExistBoardId,
				subtask: {
					id: new Types.ObjectId().toString(),
				},
			};
			const expectedError = CustomError.notFound('Board not found');

			try {
				//Act
				await boardMongoDatasource.updateSubtask(updateSubtaskDto as UpdateSubtaskDto);
			} catch (error) {
				//Assert
				expect(error).toEqual(expectedError);
				expect(error).toBeInstanceOf(CustomError);
			}
		});
		test('Should throw an error if subtask do not exist', async () => {
			//Arrange
			const nonExistSubtask = new Types.ObjectId().toString();
			const updateSubtaskDto = {
				boardId: seedData.boards[0]._id,
				subtask: {
					id: nonExistSubtask,
				},
			};
			const expectedError = CustomError.notFound('Subtask not found');

			try {
				//Act
				await boardMongoDatasource.updateSubtask(updateSubtaskDto as UpdateSubtaskDto);
			} catch (error) {
				//Assert
				expect(error).toEqual(expectedError);
				expect(error).toBeInstanceOf(CustomError);
			}
		});
		//Success
		test('Should completely update a subtask', async () => {
			try {
				//Arrange
				const boardDb = await BoardModel.findById(seedData.boards[0]._id);
				const entityBoard = BoardEntity.fromObject(boardDb!);
				const mockSubtaskDb = entityBoard.columns[0].tasks[1].subtasks[0];

				const mockSubtask = {
					id: mockSubtaskDb.id,
					isCompleted: !mockSubtaskDb.isCompleted,
					title: 'Completely update',
				};

				const { updateSubtaskDto } = UpdateSubtaskDto.create({
					boardId: mockBoard.id,
					subtask: mockSubtask,
				});

				// Act
				const updatedSubtask = await boardMongoDatasource.updateSubtask(updateSubtaskDto as UpdateSubtaskDto);
				console.log(updatedSubtask);

				// Assert
				expect(updatedSubtask).toEqual(mockSubtask);
				expect(updatedSubtask.id).toBe(mockSubtaskDb.id);
			} catch (error) {
				expect(error).toBe(undefined);
			}
		});
		test('Should partially update a subtask', async () => {
			try {
				//Arrange
				const boardDb = await BoardModel.findById(seedData.boards[0]._id);
				const entityBoard = BoardEntity.fromObject(boardDb!);
				const mockSubtaskDb = entityBoard.columns[0].tasks[1].subtasks[0];

				const mockSubtask = {
					id: mockSubtaskDb.id,
					isCompleted: !mockSubtaskDb.isCompleted,
				};
				const { updateSubtaskDto } = UpdateSubtaskDto.create({
					boardId: mockBoard.id,
					subtask: mockSubtask,
				});
				// Act
				const updatedSubtask = await boardMongoDatasource.updateSubtask(updateSubtaskDto as UpdateSubtaskDto);
				// Assert
				expect(updatedSubtask.id).toBe(mockSubtaskDb.id);
				expect(updatedSubtask.isCompleted).toBe(mockSubtask.isCompleted);
				expect(updatedSubtask.title).toBe(mockSubtaskDb.title);
			} catch (error) {
				expect(error).toBe(undefined);
			}
		});
	});
});
