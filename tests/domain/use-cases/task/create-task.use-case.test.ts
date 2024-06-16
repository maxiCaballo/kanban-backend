import {
	BoardDatasourceMongoImpl,
	BoardRepositoryImpl,
	TaskRepositoryImpl,
	TaskDatasourceMongoImpl,
	UserDatasourceMongoImpl,
	UserRepositoryImpl,
} from '@/infrastructure';
import { CreateTaskDto, CreateTaskUseCase, CustomError, BoardEntity, GetBoardUseCase } from '@/domain';
import { BoardModel, seedData } from '@/data';
import { mongoDbTest } from '../../../helpers/mongo';
import { Types } from 'mongoose';
import { LodashAdapter as _ } from '@/config';

const userMongoDatasource = new UserDatasourceMongoImpl();
const userRepository = new UserRepositoryImpl(userMongoDatasource);

const boardMongoDatasource = new BoardDatasourceMongoImpl();
const boardRepository = new BoardRepositoryImpl(boardMongoDatasource);

const taskMongoDatasource = new TaskDatasourceMongoImpl(boardMongoDatasource);
const taskRepository = new TaskRepositoryImpl(taskMongoDatasource);

const getBoardUseCase = new GetBoardUseCase(boardRepository);
const createTaskUseCase = new CreateTaskUseCase(getBoardUseCase, taskRepository, userRepository);

describe('Test on create-task.use-case.ts', () => {
	let boardDb;
	let boardDbEntity: BoardEntity;
	let adminBoard = seedData.boards[0].admin;
	beforeAll(async () => {
		await mongoDbTest.connect();
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();

		try {
			const seedBoardId = seedData.boards[0]._id;

			boardDb = await BoardModel.findById(seedBoardId);
			boardDbEntity = BoardEntity.fromObject(boardDb!);

			expect(boardDbEntity).toBeInstanceOf(BoardEntity);
		} catch (error) {
			expect(error).toBeUndefined();
		}
	});

	beforeEach(async () => {
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();
	});

	afterAll(async () => {
		// await mongoDbTest.deleteAllData();
		await mongoDbTest.disconnect();
	});

	describe('Errors', () => {
		test('Should throw an error if column do not exist on board', async () => {
			//Arrange

			const inexistentColumn = 'aaAaaAaa!';
			const mockErrorDto = {
				boardId: boardDbEntity.id,
				userId: boardDbEntity.admin,
				task: {
					title: 'Test create task',
					status: inexistentColumn,
				},
			};
			const expectedError = CustomError.notFound(`Column '${inexistentColumn}' not found`);
			try {
				//Act
				await createTaskUseCase.execute(mockErrorDto as CreateTaskDto);
				expect(true).toBeFalsy();
			} catch (error) {
				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if some user of task users is not a member or admin', async () => {
			//Arrange
			const inexistentUser = '65fb34bafd3f5c84bc4b1eda';
			const mockErrorDto = {
				boardId: boardDbEntity.id,
				userId: boardDbEntity.admin,
				task: {
					title: 'Test create task',
					status: boardDbEntity.columns[0].name,
					users: [inexistentUser],
				},
			};
			const expectedError = CustomError.unAuthorized(`Some user is not a member of this Board`);
			try {
				//Act
				await createTaskUseCase.execute(mockErrorDto as CreateTaskDto);
				expect(true).toBeFalsy();
			} catch (error) {
				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if the creator of the task do not exist on database', async () => {
			//Arrange
			const inexistentUser = new Types.ObjectId().toString();
			const { createTaskDto: mockErrorDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				userId: inexistentUser,
				task: {
					title: 'Test create task',
					status: boardDbEntity.columns[0].name,
					users: [],
				},
			});
			const expectedError = CustomError.notFound(`User: ${inexistentUser} not found`);
			try {
				//Act
				await createTaskUseCase.execute(mockErrorDto as CreateTaskDto);
				expect(true).toBeFalsy();
			} catch (error) {
				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if the creator of the task exist on database but is not a member or admin of the board', async () => {
			//Arrange
			const errorUser = '65fb34bafd3f5c84bc4b1eda'; //Existent user but not a member or admin of the board
			const { createTaskDto: mockErrorDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				userId: errorUser,
				task: {
					title: 'Test create task',
					status: boardDbEntity.columns[0].name,
					users: [],
				},
			});
			const expectedError = CustomError.unAuthorized();
			try {
				//Act
				await createTaskUseCase.execute(mockErrorDto as CreateTaskDto);
				expect(true).toBeFalsy();
			} catch (error) {
				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if some user of the task do not exist on database but is a member or admin of the board, this should not occur', async () => {
			//Arrange
			const inexistentUserOnDb = new Types.ObjectId().toString();

			const { _id, users } = seedData.boards[0];
			const { createTaskDto: mockErrorDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				userId: adminBoard,
				task: {
					title: 'Test create task',
					status: boardDbEntity.columns[0].name,
					users: [inexistentUserOnDb],
				},
			});
			const expectedError = CustomError.internalServer();

			await boardRepository.updateBoard({ id: _id, users: [...users, inexistentUserOnDb] });

			try {
				//Act
				await createTaskUseCase.execute(mockErrorDto as CreateTaskDto);

				expect(true).toBeFalsy();
			} catch (error) {
				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
	});
	describe('Ok', () => {
		test('Should return the task with the member in the list of task users, if the member was not already added', async () => {
			//Arrange
			const { createTaskDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				userId: '65fb34bafd3f5c84bc4b1ed6',
				task: {
					title: 'test create task',
					status: boardDbEntity.columns[0].name,
					users: [],
					description: '',
					subtasks: [],
				},
			});

			try {
				//Act
				const updatedTaskResponse = await createTaskUseCase.execute(createTaskDto as CreateTaskDto);

				const expectedResult = _.areEquals(updatedTaskResponse.task, createTaskDto!.task, 'id');

				expect(expectedResult).toBe(true);
				//Assert
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
		test('Should return the task with empty users because is an admin who creates it and the task users have no users', async () => {
			//Arrange
			const { createTaskDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				userId: adminBoard,
				task: {
					title: 'test create task',
					status: boardDbEntity.columns[0].name,
					users: [],
					description: '',
					subtasks: [],
				},
			});

			try {
				//Act
				const updatedTaskResponse = await createTaskUseCase.execute(createTaskDto as CreateTaskDto);

				const expectedResult = _.areEquals(updatedTaskResponse.task, createTaskDto!.task, 'id');

				expect(expectedResult).toBe(true);
				//Assert
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
		test('Should return the task with admin as one of memeber', async () => {
			//Arrange
			const { createTaskDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				userId: '65fb34bafd3f5c84bc4b1ed6',
				task: {
					title: 'test create task',
					status: boardDbEntity.columns[0].name,
					users: [adminBoard],
					description: '',
					subtasks: [],
				},
			});

			try {
				//Act
				const updatedTaskResponse = await createTaskUseCase.execute(createTaskDto as CreateTaskDto);

				const expectedResult = _.areEquals(updatedTaskResponse.task, createTaskDto!.task, 'id');

				expect(expectedResult).toBe(true);
				//Assert
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
	});
});

/*
Members
		'65fb34bafd3f5c84bc4b1ed5',
		'65fb34bafd3f5c84bc4b1ed6',
		'65fb34bafd3f5c84bc4b1ed7',
		'65fb34bafd3f5c84bc4b1ed8',
		'65fb34bafd3f5c84bc4b1ed9',

*/
