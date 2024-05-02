import { BoardDatasourceMongoImpl, BoardRepositoryImpl } from '@/infrastructure';
import { CreateTaskDto, CreateTaskUseCase, CustomError, BoardEntity } from '@/domain';
import { BoardModel, seedData } from '@/data';
import { mongoDbTest } from '../../../tests/helpers/mongo';
import { Types } from 'mongoose';

const boardMongoDatasource = new BoardDatasourceMongoImpl();
const boardRepository = new BoardRepositoryImpl(boardMongoDatasource);
const createTaskUseCase = new CreateTaskUseCase(boardRepository);

describe('Test on create-task.use-case.ts', () => {
	let boardDb;
	let boardDbEntity: BoardEntity;
	beforeAll(async () => {
		await mongoDbTest.connect();
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();

		try {
			boardDb = await BoardModel.findById(seedData.boards[0]._id);
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
		await mongoDbTest.deleteAllData();
		await mongoDbTest.disconnect();
	});
	describe('Errors', () => {
		test('Should throw an error if it does not find the board', async () => {
			//Arrange
			const mockErrorDto = {
				boardId: new Types.ObjectId().toString(),
				task: {
					title: 'Test create taskk',
					status: 'todo',
				},
			};
			const expectedError = CustomError.notFound('Board not found');

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
		test('Should throw an error if tasks status do not exist on board', async () => {
			//Arrange
			const inexistentColumn = 'aaaa';
			const mockErrorDto = {
				boardId: boardDbEntity.id,
				task: {
					title: 'Test create task',
					status: inexistentColumn,
				},
			};
			const expectedError = CustomError.notFound(`Column ${mockErrorDto.task.status} do not exsit on this board`);
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
		test('Should throw an error if some user of users do not exist on board ', async () => {
			//Arrange
			const inexistentUser = new Types.ObjectId().toString();
			const mockErrorDto = {
				boardId: boardDbEntity.id,
				task: {
					title: 'Test create task',
					status: boardDbEntity.columns[0].name,
					users: [inexistentUser],
				},
			};
			const expectedError = CustomError.notFound(`User in task: ${inexistentUser} not found `);
			try {
				//Act
				await createTaskUseCase.execute(mockErrorDto as CreateTaskDto);
				expect(true).toBeFalsy();
			} catch (error) {
				console.log(error);

				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
	});
});
