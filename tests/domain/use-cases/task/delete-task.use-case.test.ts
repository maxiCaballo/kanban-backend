import {
	BoardDatasourceMongoImpl,
	BoardRepositoryImpl,
	TaskRepositoryImpl,
	TaskDatasourceMongoImpl,
} from '@/infrastructure';
import { DeleteTaskUseCase, CustomError, BoardEntity, GetBoardUseCase, TaskEntity, DeleteTaskDto } from '@/domain';
import { BoardModel, seedData } from '@/data';
import { mongoDbTest } from '../../../helpers/mongo';
import { LodashAdapter as _ } from '@/config';
import { Types } from 'mongoose';

const boardMongoDatasource = new BoardDatasourceMongoImpl();
const boardRepository = new BoardRepositoryImpl(boardMongoDatasource);

const taskMongoDatasource = new TaskDatasourceMongoImpl(boardMongoDatasource);
const taskRepository = new TaskRepositoryImpl(taskMongoDatasource);

const getBoardUseCase = new GetBoardUseCase(boardRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(getBoardUseCase, taskRepository);

describe('Test on create-task.use-case.ts', () => {
	let boardDb;
	let boardDbEntity: BoardEntity;
	let adminBoard = seedData.boards[0].admin;
	const mockTask = TaskEntity.fromObject(seedData.boards[0].columns[0].tasks[0]);
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
		test('Should throw an error if user is not an admin or member of the board and exist on Db', async () => {
			//Arrange
			const expectedResult = CustomError.unAuthorized();
			const { deleteTaskDto } = DeleteTaskDto.create({
				boardId: boardDbEntity.id,
				userId: '65fb34bafd3f5c84bc4b1eda',
				taskId: mockTask.id,
			});

			//Act
			try {
				await deleteTaskUseCase.execute(deleteTaskDto!);
				expect(true).toBe(false);
			} catch (error) {
				//Assert
				expect(error).toEqual(expectedResult);
				expect(error).toBeInstanceOf(CustomError);
			}
		});
		test('Should throw an error if task to delete do not exist', async () => {
			//Arrange
			const expectedResult = CustomError.notFound('Task not found');
			const { deleteTaskDto } = DeleteTaskDto.create({
				boardId: boardDbEntity.id,
				userId: adminBoard,
				taskId: new Types.ObjectId().toString(),
			});

			//Act
			try {
				await deleteTaskUseCase.execute(deleteTaskDto!);
				expect(true).toBe(false);
			} catch (error) {
				console.log(error);

				//Assert
				expect(error).toEqual(expectedResult);
				expect(error).toBeInstanceOf(CustomError);
			}
		});
	});
	describe('Ok', () => {
		test('Should delete a task', async () => {
			//Arrange
			const firstColumn = 0;
			const expectedResult = mockTask;
			const tasksBeforeDelete = boardDbEntity.columns[firstColumn].tasks;
			let tasksAfterDelete: TaskEntity[];
			const { deleteTaskDto } = DeleteTaskDto.create({
				boardId: boardDbEntity.id,
				userId: adminBoard,
				taskId: mockTask.id,
			});

			try {
				//Act
				const deletedTask = await deleteTaskUseCase.execute(deleteTaskDto!);
				const boardDbAfterDeleteTask = await BoardModel.findById(boardDbEntity.id);
				tasksAfterDelete = BoardEntity.fromObject(boardDbAfterDeleteTask!).columns[firstColumn].tasks;
				const beforeAndAfterTasksAreNotEqual = !_.listOfObjectsAreEquals(tasksBeforeDelete, tasksAfterDelete);

				//Assert
				expect(deletedTask.task).toEqual(expectedResult);
				expect(beforeAndAfterTasksAreNotEqual).toBe(true);
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
	});
});

/*
Members
        '65fb34bafd3f5c84bc4b1ed4' admin
        '65fb34bafd3f5c84bc4b1ed5',
		'65fb34bafd3f5c84bc4b1ed6',
		'65fb34bafd3f5c84bc4b1ed7',
		'65fb34bafd3f5c84bc4b1ed8',
		'65fb34bafd3f5c84bc4b1ed9',

*/
