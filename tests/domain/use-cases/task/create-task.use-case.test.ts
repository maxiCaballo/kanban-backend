import {
	BoardDatasourceMongoImpl,
	BoardRepositoryImpl,
	TaskRepositoryImpl,
	TaskDatasourceMongoImpl,
} from '@/infrastructure';
import { CreateTaskDto, CreateTaskUseCase, CustomError, BoardEntity, TaskResponse, ColumnEntity } from '@/domain';
import { BoardModel, seedData } from '@/data';
import { mongoDbTest } from '../../../helpers/mongo';
import { Types } from 'mongoose';
import { LodashAdapter as _ } from '@/config';

const boardMongoDatasource = new BoardDatasourceMongoImpl();
const boardRepository = new BoardRepositoryImpl(boardMongoDatasource);

const taskMongoDatasource = new TaskDatasourceMongoImpl(boardMongoDatasource);
const taskRepository = new TaskRepositoryImpl(taskMongoDatasource);

const createTaskUseCase = new CreateTaskUseCase(boardRepository, taskRepository);

describe('Test on create-task.use-case.ts', () => {
	let boardDb;
	let boardDbEntity: BoardEntity;
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
				//Assert
				expect(error).toBeDefined();
				expect(error).toBeInstanceOf(CustomError);
				expect(error).toEqual(expectedError);
			}
		});
	});
	describe('Ok', () => {
		test('Should return TaskResponse if column have more tasks', async () => {
			//Arrange
			const { createTaskDto } = CreateTaskDto.create({
				boardId: boardDbEntity.id,
				task: {
					title: 'test create task',
					status: 'todo',
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
	});
});
